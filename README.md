# 🕷️ JSpider V2.1 - Advanced JavaScript Crawler & Endpoint Discovery
---

<div align="center">

![JSpider](JSpider-cover.png)

**The ultimate client-side reconnaissance tool for security researchers. Extract hidden API routes, sensitive parameters, and hardcoded secrets instantly from any website.**

**Built for recon - Fast, lightweight and 100% client-side.**

[![Built with](https://img.shields.io/badge/Built%20with-HTML%20%7C%20CSS%20%7C%20JavaScript-blue?style=for-the-badge&logo=javascript)](https://iamshafayat.github.io/JSpider/)  
[![License](https://img.shields.io/badge/license-Apache%202.0-blue?style=flat-square)](LICENSE)
</div>

---

## 🌐 Live

👉 Try JSpider V2.1 now:  
**[https://iamshafayat.github.io/JSpider/](https://iamshafayat.github.io/JSpider/)**

---

## 🚀 Major Updates (V2.1)
JSpider V2.1 expands secret detection and refines the reconnaissance suite with broader pattern coverage and enhanced filtering.

### ✨ Key Features:
- **Sensitive Path Prober**: Automated checks for **500+ critical paths** including `.env`, `.git/config`, `phpinfo.php`, backups, and cloud configurations. Features live response length filtering, instantaneous stop controls, and one-click inspection for 200/403 responses.
- **Parameter Discovery**: Dedicated extraction and grouping of URL parameters to identify potential injection points.
- **Recursive Discovery Engine**: Full website crawling capability (Depth 1) with deep script analysis to find hidden routes.
- **Precision Secret Detection**: High-fidelity regex for **40 patterns** including AWS, Google Cloud, Stripe, Slack/Discord Webhooks, JWT, Telegram, Twilio, and more.
- **High-Fidelity Mapping**: Captures raw file paths and absolute URLs without truncation, preserving double slashes and complex structures.
- **Authentication Headers**: Crawl behind login pages inject session cookies or Bearer tokens to scan authenticated dashboards, admin panels, and internal tools that general scanners miss.
- **Parameters Dashboard**: Live tracking, filtering, and sorting of URL parameters alongside Endpoints, Secrets, and Files.

---

## 📌 What is JSpider?

**JSpider** is a powerful security reconnaissance tool designed for:
- 🔍 **Endpoint Discovery**: Find hidden routes and API calls.
- 🔑 **Secret Detection**: Automatically identify API keys, tokens, and sensitive data.
- 🕷️ **Recursive Crawling**: Deeper discovery by following same-domain links.
- 🧩 **Reverse Engineering**: Analyze client-side behavior and dynamic URLs.

It extracts data from external JS files, inline scripts, and HTML source code - instantly and completely in your browser.

---

## ✨ Advanced Features

| Feature | Description |
|------|-------------|
| 🔑 **Secret Detection** | High-fidelity detection for 40 patterns including AWS, Google, Stripe, Slack/Discord Webhooks, JWT, Telegram, Twilio, and more. |
| 🕷️ **Recursive Scan** | Depth-limited (V2.1: Depth 1) crawling of internal links. |
| 📊 **Real-time Stats** | Live dashboard tracking Scanned URLs, Endpoints, Parameters, Secrets, and Files. |
| 🛡️ **Path Prober** | Automated check for 500+ paths with live response lengths, status filters, include/exclude length filtering, and stop controls. |
| 🎯 **Result Filtering** | Instantly sort findings into Endpoints, Parameters, Secrets, and Files with a global search filter. |
| 🔐 **Auth Headers** | Crawl dashboard panels & authenticated pages that general scanners miss. Inject session cookies or Bearer tokens to access protected endpoints - just paste your Cookie or Authorization header value. |
| 📄 **Advanced Export** | Export to `.txt`, `.json`, `.csv`, and professional `.md` reports. |
| ✅ **100% Client-Side** | No backend, no data leakage - privacy-focused by design. |

---

## 🔐 Authentication Headers Crawl Behind Login Pages

General scanners can't see past login pages. JSpider's **Authentication Header Injection** lets you scan authenticated dashboards, admin panels, and internal tools — the places where real endpoints live.

**How it works:**
- 🍪 **Cookie**: Grab your session cookie from the browser (e.g., `PHPSESSID=abc123; token=xyz`) and paste it into the **Cookie** field. JSpider sends it with every request, just like a logged-in browser.
- 🔑 **Bearer Token**: Copy your `Authorization: Bearer <token>` value and paste it into the **Authorization** field. JSpider attaches it to all scan and probe requests automatically.

Available for both **Smart Crawler** and **Sensitive Path Prober** — click the *Authentication / Custom Headers* toggle to expand the fields before scanning.

---

## 🚫 Noise Protection (Smart Filtering)

JSpider automatically excludes architectural noise to focus on valuable recon:
- **Static Assets**: Blocks `*.png`, `*.css`, `*.woff`, `*.svg`, etc.
- **Social & Analytics**: Filters LinkedIn, Facebook, Google Analytics, GTM, etc.
- **Known CDNs**: Ignores common libraries from jsDelivr, cdnjs, unpkg, etc.
- **Invalid Prefixes**: Excludes `data:`, `blob:`, `mailto:`, `tel:`, etc.

---

## 🧪 Usage Guide

### 🕷️ Smart Crawler
1. Visit **[https://iamshafayat.github.io/JSpider/](https://iamshafayat.github.io/JSpider/)**
2. Enter a target URL (e.g., `https://example.com`).
3. Click **Scan Page** for a quick analysis or **Full Scan** for recursive domain discovery.
4. Monitor the **Dashboard** to see live extractions of Endpoints, Parameters, Secrets, and Files.
5. Use the **Category Tabs** to filter results and the **Global Search** for specific keywords.
6. **Export** your findings in `.txt`, `.json`, `.csv`, or `.md` formats.

### 🛡️ Sensitive Path Prober
1. Switch to the **Sensitive Path Prober** tab from the header menu.
2. Enter the target domain (e.g., `https://example.com`).
3. Click **Check Paths** to start probing **500+ critical paths** (e.g., `.env`, `.git`, `phpinfo.php`).
4. Watch the **Progress Bar** and live **Status Counters** (200, 403, 404).
5. Use the **Status Filters** (Found, Forbidden, Missing) to analyze the detected paths live.
6. **Advanced Filtering**: Use the **Include/Exclude Lengths** inputs to filter out standard WAF block pages by their byte size (e.g., exclude `127, 403`).
7. 🔗 Use the **OPEN🔗** buttons to instantly verify 200 and 403 leaks in a new tab.

---

## 🧰 Built With

- **Structure**: HTML5 & CSS3 (Advanced Glassmorphism UI)
- **Logic**: Vanilla JavaScript (ES6+ / Async-Await)
- **Engine**: High-Precision Regex Engine (40 secret patterns)
- **Proxy**: Cloudflare Workers (Lightweight Proxy for CORS bypass)

---

## 📝 License
This project is licensed under the [Apache License 2.0](LICENSE).

---

## 👤 Authors
Made with ❤️ by <b>[Shafayat Ahmed Alif](https://www.linkedin.com/in/iamshafayat/) & [Kazi Sabbir](https://www.linkedin.com/in/kazisabbir1337/)</b> for Security Researchers.  
*Feel free to connect or suggest improvements.*
