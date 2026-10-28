# Resumake (Client-Side Vanilla JS)

A vibecoded open-source static resume generator written in client-side Vanilla JavaScript remake of resumake. No backend servers, external APIs, build steps, or npm dependencies required.

When [resumake.io from saadq](https://github.com/saadq/resumake.io) went offline I cloned the github, and pointed jules.google.com at it and said, hey, remake this but client-side vanilla javascript and it did, and this is the result. 
I don't know if this is an ethical engagement with AI. I don't know if there is ethical engagement with AI.

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

### Github Page

You can use it at [https://e3la.github.io/js-remix-resumake-with-jules/](https://e3la.github.io/js-remix-resumake-with-jules/)

### License
MIT © Saad Quadri
