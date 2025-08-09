const scanBtn = document.getElementById("scanBtn");
const urlInput = document.getElementById("urlInput");
const results = document.getElementById("results");
const status = document.getElementById("status");
const exportActions = document.getElementById("actions");
const exportTxt = document.getElementById("exportTxt");
const exportJson = document.getElementById("exportJson");

const allResults = [];

const proxyUrl = (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`;

const endpointRegex = new RegExp(
  `(?:"|')((?:[a-zA-Z]{1,10}://|//)[^"']*?|(?:/|\\./|\\.\\./)[^"'\\s<>]+|[a-zA-Z0-9_\\-/]+\\.[a-z]{1,5}(?:\\?[^"'\\s]*)?)(?:"|')`,
  "g"
);

const excludedExtensions = [
  ".woff", ".woff2", ".ttf", ".otf", ".png", ".jpg", ".jpeg", ".svg",
  ".gif", ".ico", ".webp", ".css", ".mp4", ".m4v", ".webm",
  ".mp3", ".wav", ".json", ".map", ".mjs"
];

const externalDomainsToIgnore = [
  "facebook.com", "instagram.com", "twitter.com", "tiktok.com", "google.com",
  "gstatic.com", "fonts.googleapis.com", "cdn.adobedtm.com", "cookielaw.org",
  "scene7.com", "helix-rum-js", "doubleclick.net", "googletagmanager.com", "youtube.com", "linkedin.com"
];

scanBtn.addEventListener("click", async () => {
  const siteUrl = urlInput.value.trim();
  if (!siteUrl || !siteUrl.startsWith("http")) {
    alert("Please enter a valid full URL with https...");
    return;
  }

  scanBtn.disabled = true;
  results.innerHTML = "";
  status.innerText = "Fetching site...";
  allResults.length = 0;
  exportActions.style.display = "none";

  try {
    const html = await fetchHtml(siteUrl);
    const jsFiles = extractJSUrls(html, siteUrl);

    if (jsFiles.length === 0) {
      status.innerText = "No JS files found.";
    } else {
      for (const jsUrl of jsFiles) {
        status.innerText = `Scanning: ${jsUrl}`;
        const endpoints = await extractEndpointsFromJS(jsUrl);
        allResults.push({ jsUrl, endpoints });
        display(jsUrl, endpoints);
      }
    }

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

  // <a> and <link> hrefs
  const hrefMatches = [...html.matchAll(/<(a|link)[^>]+href=["']([^"']+)["']/gi)];
  rawHtmlTargets.push(...hrefMatches.map(m => m[2]));

  // Inline <script>
  const scriptContentMatches = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
  scriptContentMatches.forEach(match => {
    const inlineCode = match[1];
    const inlineEndpoints = [...inlineCode.matchAll(endpointRegex)]
      .map(m => m[1])
      .filter(url => {
        const lowered = url.toLowerCase();
        return (
          !excludedExtensions.some(ext => lowered.endsWith(ext)) &&
          !externalDomainsToIgnore.some(domain => lowered.includes(domain)) &&
          !lowered.includes("base64") &&
          lowered.length < 300
        );
      });
    rawHtmlTargets.push(...inlineEndpoints);
  });

  const filteredHtmlLinks = [];
  const jsToScanFromLinks = [];

  for (let link of rawHtmlTargets) {
    const lowered = link.toLowerCase();
    const isFull = lowered.startsWith("http://") || lowered.startsWith("https://");
    const isJsOrJson = lowered.endsWith(".js") || lowered.endsWith(".json");

    if (!isFull && isJsOrJson) {
      try {
        const fullUrl = new URL(link, baseUrl).href;
        jsToScanFromLinks.push(fullUrl);
      } catch (e) {
        console.warn("Invalid relative link:", link);
      }
      continue;
    }

    if (
      !excludedExtensions.some(ext => lowered.endsWith(ext)) &&
      !externalDomainsToIgnore.some(domain => lowered.includes(domain)) &&
      !lowered.includes("base64") &&
      lowered.length < 300
    ) {
      filteredHtmlLinks.push(link);
    }
  }

  if (filteredHtmlLinks.length > 0) {
    allResults.push({ jsUrl: "Visible HTML Links", endpoints: [...new Set(filteredHtmlLinks)] });
    display("Visible HTML Links", [...new Set(filteredHtmlLinks)]);
  }

  for (const jsUrl of jsToScanFromLinks) {
    status.innerText = `Scanning [href] JS: ${jsUrl}`;
    const endpoints = await extractEndpointsFromJS(jsUrl);
    allResults.push({ jsUrl, endpoints });
    display(jsUrl, endpoints);
  }

  return html;
}

function extractJSUrls(html, baseUrl) {
  const re = /<script[^>]+src=["']([^"']+)["']/gi;
  let match, urls = [];

  while ((match = re.exec(html)) !== null) {
    try {
      const fullUrl = new URL(match[1], baseUrl).href;
      const lowered = fullUrl.toLowerCase();

      const isExternal = !fullUrl.includes(new URL(baseUrl).hostname);
      const isGarbage = excludedExtensions.some(ext => lowered.endsWith(ext));
      const isBlockedDomain = externalDomainsToIgnore.some(domain => lowered.includes(domain));

      if (isExternal || isGarbage || isBlockedDomain) continue;

      urls.push(fullUrl);
    } catch {}
  }

  return [...new Set(urls)];
}

async function extractEndpointsFromJS(jsUrl) {
  try {
    const res = await fetch(proxyUrl(jsUrl));
    const code = await res.text();
    const matches = [...code.matchAll(endpointRegex)];
    const raw = matches.map(m => m[1]);

    const filtered = [...new Set(
      raw.filter(url => {
        const lowered = url.toLowerCase();
        return (
          !excludedExtensions.some(ext => lowered.endsWith(ext)) &&
          !externalDomainsToIgnore.some(domain => lowered.includes(domain)) &&
          !lowered.includes("base64") &&
          lowered.length < 300
        );
      })
    )];

    return filtered;
  } catch (e) {
    console.warn("Could not fetch:", jsUrl);
    return [];
  }
}

function display(jsUrl, endpoints) {
  const container = document.createElement("div");
  container.className = "card";

  if (jsUrl.includes("Visible HTML Links")) {
    container.classList.add("html-section");
  }

  const title = document.createElement("h3");
  title.innerText = jsUrl;

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

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(endpoint);
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.classList.remove("copied");
      }, 1000);
    });

    item.appendChild(endpointSpan);
    item.appendChild(copyBtn);
    list.appendChild(item);
  });

  if (endpoints.length === 0) {
    const fallback = document.createElement("pre");
    fallback.innerText = "No endpoints found.";
    container.appendChild(title);
    container.appendChild(fallback);
  } else {
    container.appendChild(title);
    container.appendChild(list);
  }

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
  link.click();
}

// ✅ Universal Endpoint Filter on All Results
document.getElementById("filterInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  document.querySelectorAll(".endpoint-text").forEach((el) => {
    const match = el.innerText.toLowerCase().includes(keyword);
    el.parentElement.style.display = match ? "flex" : "none";
  });
});