const scanBtn = document.getElementById("scanBtn");
const urlInput = document.getElementById("urlInput");
const results = document.getElementById("results");
const status = document.getElementById("status");
const exportActions = document.getElementById("actions");
const exportTxt = document.getElementById("exportTxt");
const exportJson = document.getElementById("exportJson");

const allResults = [];
const scannedJs = new Set(); // avoid duplicate scans across sources

const proxyUrl = (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

const endpointRegex = new RegExp(
  `(?:"|')((?:[a-zA-Z]{1,10}://|//)[^"']*?|(?:/|\\./|\\.\\./)[^"'\\s<>]+|[a-zA-Z0-9_\\-/]+\\.[a-z]{1,5}(?:\\?[^"'\\s]*)?)(?:"|')`,
  "g"
);

// BLOCK garbage resource extensions
const excludedExtensions = [
  ".woff", ".woff2", ".ttf", ".otf", ".eot", ".sfnt",
  ".png", ".jpg", ".jpeg", ".svg", ".gif", ".ico", ".webp", ".bmp", ".apng", ".tif", ".tiff",
  ".css", ".less", ".sass",
  ".map", ".txt",
  ".mp4", ".m4v", ".webm", ".mp3", ".wav", ".ogg", ".flac",
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".csv", ".rtf",
  ".zip", ".rar", ".tar", ".gz", ".7z",
  ".exe", ".apk", ".ipa", ".dmg", ".bin", ".jar", ".class",
  ".swf", ".log", ".tmp", ".bak", ".old", ".drag", ".brush", ".zoom", ".time", ".name", ".width", ".calcs"
];

// BLOCK garbage/tracker domains
const externalDomainsToIgnore = [
  "facebook.com", "instagram.com", "twitter.com", "tiktok.com", "linkedin.com",
  "youtube.com", "vimeo.com", "pinterest.com", "cdn.jsdelivr.net", "cdnjs.cloudflare.com",
  "unpkg.com", "bootstrapcdn.com", "maxcdn.bootstrapcdn.com",
  "fonts.googleapis.com", "fonts.gstatic.com",
  "gstatic.com", "google.com", "googleapis.com",
  "googletagmanager.com", "googlesyndication.com", "google-analytics.com", "gtag/js",
  "doubleclick.net", "cookielaw.org", "cdn.adobedtm.com", "scene7.com",
  "akamaihd.net", "brightcove.net", "vidyard.com", "wistia.com",
  "newrelic.com", "datadoghq.com", "cloudflareinsights.com",
  "optimizely.com", "hotjar.com", "segment.com", "intercom.io",
  "salesforce.com", "liveperson.net", "zendesk.com", "helix-rum-js",
  "sentry.io", "mixpanel.com", "disqus.com", "addthis.com", "sharethis.com", "criteo.com",
  "tracking.", "pixel.", "collect.", "recaptcha.net", "lazcdn.com", "alicdn.com"
];

// BLOCK garbage prefixes like markup://, js://, aura://
const disallowedPrefixes = [
  "js://", "markup://", "aura://", "java://", "css://",
  "object://", "text://", "xml://", "apex://", "apexclass://",
  "resource://", "data://", "mailto:", "tel:", "blob:", "file://",
  "intent://", "chrome-extension://", "about:", "chrome://"
];

scanBtn.addEventListener("click", async () => {
  let siteUrl = urlInput.value.trim();
  if (!siteUrl) {
    alert("Enter a valid full URL (e.g., https://example.com)");
    return;
  }
  if (!/^https?:\/\//i.test(siteUrl)) {
    siteUrl = "https://" + siteUrl; // auto-HTTPS for convenience
  }

  scanBtn.disabled = true;
  results.innerHTML = "";
  status.innerText = "Fetching site...";
  allResults.length = 0;
  scannedJs.clear();
  exportActions.style.display = "none";

  try {
    const html = await fetchHtml(siteUrl);
    const jsFiles = extractJSUrls(html, siteUrl);

    // Full parallel scan (no limit)
    let completed = 0;
    await Promise.all(
      jsFiles.map(async (jsUrl) => {
        if (scannedJs.has(jsUrl)) return;
        scannedJs.add(jsUrl);

        status.innerText = `Scanning: ${jsUrl}`;
        const endpoints = await extractEndpointsFromJS(jsUrl);
        allResults.push({ jsUrl, endpoints });
        display(jsUrl, endpoints);
        completed++;
        status.innerText = `Scanned ${completed}/${jsFiles.length}`;
      })
    );

    status.innerText = "Scan complete!";
    exportActions.style.display = allResults.length ? "flex" : "none";

    const filterSection = document.getElementById("filter-section");
    const filterInput = document.getElementById("filterInput");
    if (filterSection && filterInput) {
      filterSection.style.display = "block";
      filterInput.value = "";
    }
  } catch (e) {
    console.error(e);
    status.innerText = "Error occurred. Try another URL.";
  }

  scanBtn.disabled = false;
});

async function fetchHtml(baseUrl) {
  const res = await fetch(proxyUrl(baseUrl));
  if (!res.ok) throw new Error("Failed to load HTML");

  const html = await res.text();
  const rawHtmlTargets = [];

  const hrefMatches = [...html.matchAll(/<(a|link)[^>]+href=["']([^"']+)["']/gi)];
  rawHtmlTargets.push(...hrefMatches.map(m => m[2]));

  const scriptContentMatches = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
  scriptContentMatches.forEach(match => {
    const inlineCode = match[1] || "";
    const inlineEndpoints = [...inlineCode.matchAll(endpointRegex)]
      .map(m => m[1])
      .filter(url => filterUrl(url));
    rawHtmlTargets.push(...inlineEndpoints);
  });

  const filteredHtmlLinks = [];
  const jsToScanFromLinks = [];

  rawHtmlTargets.forEach(link => {
    if (!link) return;
    const lowered = link.toLowerCase();
    const isFull = lowered.startsWith("http://") || lowered.startsWith("https://");
    const isJsOrJson = lowered.endsWith(".js") || lowered.endsWith(".json");

    if (!isFull && isJsOrJson) {
      try {
        const fullUrl = new URL(link, baseUrl).href;
        jsToScanFromLinks.push(fullUrl);
      } catch {}
      return;
    }

    if (filterUrl(lowered)) {
      filteredHtmlLinks.push(link);
    }
  });

  if (filteredHtmlLinks.length > 0) {
    const dedup = [...new Set(filteredHtmlLinks)];
    allResults.push({ jsUrl: "Visible HTML Links", endpoints: dedup });
    display("Visible HTML Links", dedup);
  }

  // Scan JS discovered via href in parallel (no limit)
  await Promise.all(
    jsToScanFromLinks.map(async (jsUrl) => {
      if (scannedJs.has(jsUrl)) return;
      scannedJs.add(jsUrl);

      status.innerText = `Scanning [href] JS: ${jsUrl}`;
      const endpoints = await extractEndpointsFromJS(jsUrl);
      allResults.push({ jsUrl, endpoints });
      display(jsUrl, endpoints);
    })
  );

  return html;
}

function extractJSUrls(html, baseUrl) {
  const re = /<script[^>]+src=["']([^"']+)["']/gi;
  let match;
  const urls = [];
  const baseHost = new URL(baseUrl).hostname.toLowerCase();

  while ((match = re.exec(html)) !== null) {
    try {
      const fullUrl = new URL(match[1], baseUrl).href;
      const lowered = fullUrl.toLowerCase();
      const host = new URL(fullUrl).hostname.toLowerCase();

      // Only scan same-site JS (correct/robust check)
      const sameSite = host === baseHost || host.endsWith("." + baseHost);
      if (!sameSite || !filterUrl(lowered)) continue;

      urls.push(fullUrl);
    } catch {}
  }

  return [...new Set(urls)];
}

async function extractEndpointsFromJS(jsUrl) {
  try {
    const res = await fetch(proxyUrl(jsUrl));
    if (!res.ok) {
      console.warn("Could not fetch (status " + res.status + "):", jsUrl);
      return [];
    }
    const code = await res.text();
    const matches = [...code.matchAll(endpointRegex)];
    const raw = matches.map(m => m[1]);
    const filtered = [...new Set(raw.filter(url => filterUrl(url)))];
    return filtered;
  } catch (e) {
    console.warn("Could not fetch:", jsUrl, e);
    return [];
  }
}

function filterUrl(url) {
  const lowered = (url || "").toLowerCase();
  return (
    lowered &&
    !excludedExtensions.some(ext => lowered.endsWith(ext)) &&
    !externalDomainsToIgnore.some(domain => lowered.includes(domain)) &&
    !disallowedPrefixes.some(prefix => lowered.startsWith(prefix)) &&
    !lowered.includes("base64") &&
    lowered.length < 300
  );
}

function display(jsUrl, endpoints) {
  const container = document.createElement("div");
  container.className = "card";

  if (jsUrl === "Visible HTML Links") {
    container.classList.add("html-section");
  }

  const title = document.createElement("h3");
  title.innerText = jsUrl;

  if (!endpoints || endpoints.length === 0) {
    const fallback = document.createElement("pre");
    fallback.innerText = "No endpoints found.";
    container.appendChild(title);
    container.appendChild(fallback);
    results.appendChild(container);
    return;
  }

  const list = document.createElement("ol");

  endpoints.forEach((endpoint) => {
    const item = document.createElement("li");
    const endpointSpan = document.createElement("span");
    endpointSpan.textContent = endpoint;
    endpointSpan.className = "endpoint-text";

    const copyBtn = document.createElement("button");
    copyBtn.innerHTML = `
      <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M8 8h11M8 12h8M8 16h6M5 4h14a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/>
      </svg>`;
    copyBtn.className = "copy-btn";
    copyBtn.title = "Copy";

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(endpoint);
      } catch {
        // Fallback for older browsers/non-HTTPS
        const ta = document.createElement("textarea");
        ta.value = endpoint;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.classList.remove("copied");
      }, 1000);
    });

    item.appendChild(endpointSpan);
    item.appendChild(copyBtn);
    list.appendChild(item);
  });

  container.appendChild(title);
  container.appendChild(list);
  results.appendChild(container);
}

exportTxt.addEventListener("click", () => {
  const content = allResults.map(entry => {
    return `${entry.jsUrl}\n-------------------------\n${entry.endpoints.join("\n")}\n`;
  }).join("\n\n");
  downloadFile("endpoints.txt", content, "text/plain");
});

exportJson.addEventListener("click", () => {
  const json = JSON.stringify(allResults, null, 2);
  downloadFile("endpoints.json", json, "application/json");
});

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  }, 0);
}

// 🔍 Universal filter across JS & HTML (guard + hide empty cards)
const filterInputEl = document.getElementById("filterInput");
if (filterInputEl) {
  filterInputEl.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();
    document.querySelectorAll(".endpoint-text").forEach((el) => {
      const match = el.innerText.toLowerCase().includes(keyword);
      el.parentElement.style.display = match ? "flex" : "none";
    });
    // Hide cards that have no visible list items
    document.querySelectorAll(".card").forEach((card) => {
      const items = card.querySelectorAll("ol li");
      if (!items.length) return;
      const anyVisible = Array.from(items).some(li => li.style.display !== "none");
      card.style.display = anyVisible ? "" : "none";
    });
  });
}
