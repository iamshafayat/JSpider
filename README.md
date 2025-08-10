# 🕷️ JSpider - Smart crawler for hidden endpoints
---

<div align="center">

![JSpider Interface Screenshot](JSpider-screenshot.png)

**Crawl and extract hidden API endpoints and URLs from JavaScript files and HTML source code — directly in your browser.**

**Built for recon - Fast, lightweight and 100% client-side.**

[![Built with](https://img.shields.io/badge/Built%20with-HTML%20%7C%20CSS%20%7C%20JavaScript-blue?style=for-the-badge&logo=javascript)](https://iamshafayat.github.io/JSpider/)  
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
</div>

---

## 🌐 Live

👉 Try JSpider now:  
**[https://iamshafayat.github.io/JSpider/](https://iamshafayat.github.io/JSpider/)**

---

## 📌 What is JSpider?

**JSpider** is a security-oriented frontend tool designed for:
- 🔍 Endpoint discovery
- 🕷️ Reconnaissance
- 🧩 Reverse engineering of client-side JS behavior

It helps you **find hidden routes, API calls, file references, and dynamic URLs** embedded in:
- External JavaScript files
- Inline `<script>` content
- Static HTML tags like `<a href>` and `<link href>`

All of this happens **instantly and completely in the browser** — no server, no data sent out.

---

## ✨ Features

| Type | Description |
|------|-------------|
| 🔎 **Scans External JS** | Parses and scans all `<script src="...">` files |
| 📜 **Scans Inline JS** | Reads and parses inline `<script>...</script>` blocks |
| 🌐 **Scans HTML Source** | Crawls `<a href>` and `<link href>` HTML tags |
| 🎯 **Smart Filtering** | Removes static files, known CDNs, invalid schemes and noise |
| ✅ **100% Client-Side** | No backend, no data leakage |
| 💡 **Minimal UI** | Clean, responsive glass-style interface |
| 🔍 **Live Search Filter** | Quickly search extracted results |
| 📄 **Export Options** | Export to `.txt` or `.json` formats |
| 📋 **Copy Button** | One-click copy of each endpoint |

---

## 🚫 What JSpider Filters Out (Noise Protection)

By default, JSpider will **exclude** the following from all sources:
- Static assets: `*.png`, `*.css`, `*.woff`, `*.svg`, etc.
- Social platforms: `facebook.com`, `instagram.com`, `tiktok.com`, etc.
- Analytics/trackers: `google.com`, `google-analytics`, GTM, etc.
- Inline `base64`, overly long or misleading strings

This keeps your results focused and free of clutter.

---

## 🧪 Usage Guide

1. Visit **[https://iamshafayat.github.io/JSpider/](https://iamshafayat.github.io/JSpider/)**

2. 🔗 Input a target domain:  
   `https://example.com`

3. 🔍 JSpider will:
   - Download HTML
   - Parse visible tags and JS
   - Extract endpoints
   - Present clean output in a grouped list

4. ✅ You can:
   - Search endpoints with a live filter box
   - Copy individual entries
   - Export data for deeper analysis

---

## 📤 Exports

After scanning, click:
- `✅ Export .txt` → for simple endpoint lists
- `📁 Export .json` → full structured results per source file

---

## 🧰 Built With

- HTML5 & CSS3 (Glassmorphism UI)
- Vanilla JavaScript (ES6+)
- Advanced Regex
- [corsproxy.io](https://corsproxy.io/) — CORS bypass for JS file access

---

## 📁 Project Structure

```bash
JSpider/
│
├── index.html       # Main UI
├── script.js        # Core JS scanning & logic
├── style.css        # Design & layout
├── favicon.png      # Icon
├── README.md        # You're here!
```

---

## 📝 License
This project is licensed under the [MIT License](LICENSE).

-----------

## 👤 Author
Made with ❤️ by [Shafayat Ahmed Alif](https://www.linkedin.com/in/iamshafayat/).
Feel free to connect or suggest improvements.
