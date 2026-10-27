# Resumake (Client-Side Vanilla JS)

A free, open-source static resume generator written in client-side Vanilla JavaScript. No backend servers, external APIs, build steps, or npm dependencies required.

## Features

- 🎨 **Multiple Resume Templates**: Modern, Classic, Minimal, and Compact.
- 🛠️ **Accordion Sidebar & Custom Themes**: Easily collapsible section editing and date/metadata font options.
- 🖨️ **Print & Page Controls**: Dedicated printable view with native browser page scaling, custom margins, and paper size controls.
- 📄 **PDF & LaTeX Export**: Direct client-side PDF download via `html2pdf.js` and `.tex` source code generation.
- 💾 **JSON Resume Support**: Import and export standard JSON Resume schema files (`localStorage` auto-saves progress).

---

## Deployment Instructions

### GitHub Pages (Main Branch)

This project is built purely with standard HTML/CSS/JS files, making it completely static and instantly compatible with GitHub Pages:

1. **Push to repository main branch**.
2. Go to your GitHub repository **Settings** -> **Pages**.
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` / `/ (root)`.
4. Click **Save**. Your site will automatically build and publish!

*A GitHub Actions workflow is also included in `.github/workflows/deploy-pages.yml` for automated deployments upon pushing to `main`.*

---

### Neocities

To host on [Neocities](https://neocities.org):

1. Log into your Neocities account.
2. Drag and drop all project files (`index.html`, `.nojekyll`, `css/`, `js/`) into your Neocities upload manager (or use the Neocities CLI / WebDAV).
3. Visit your Neocities URL!

---

## Local Development

Simply open `index.html` in any web browser or use a simple HTTP server:

```bash
npx serve .
# or
python3 -m http.server 8000
```
