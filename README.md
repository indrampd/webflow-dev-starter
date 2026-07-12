# 🚀 Webflow Developer Starter Kit

A modern, fast, and secure local development environment for writing custom JavaScript and CSS for Webflow websites. Powered by [Vite](https://vite.dev/) and configured with secure local HTTPS (`mkcert`) and CORS support.

---

## 📖 Why Use This Starter Kit?

Webflow's built-in custom code editor is highly restrictive:
- **No package management:** You cannot easily use npm libraries.
- **Character limits:** Webflow page/project settings limit your custom code size.
- **No developer tooling:** No ESLint, Prettier, TypeScript, or modular imports.
- **Slow feedback loop:** You have to constantly publish your Webflow site to see changes.

**With this starter kit**, you write code in your local IDE (e.g., VS Code), enjoy full ESM import capabilities, and see your updates reflect **instantly** (Hot Module Replacement) on your staging Webflow site (`*.webflow.io`) without republishing.

---

## ✨ Features

- ⚡ **Vite-Powered:** Instant server start and lightning-fast Hot Module Replacement (HMR).
- 🔒 **Local HTTPS (SSL):** Automatically generates local certificates using `vite-plugin-mkcert`. Since Webflow sites use HTTPS, loading local scripts requires an HTTPS local server to prevent browser **Mixed Content** blocked errors.
- 🌐 **CORS Pre-configured:** Development server accepts cross-origin requests, allowing Webflow pages to load your local scripts.
- 📦 **Asset Bundling:** Automatically minifies, groups, and outputs production assets (`dist/`) with clear directory structures (CSS, JS, Fonts, Images, 3D Models).
- 🔄 **Auto-Restart:** Configured with `vite-plugin-restart` to reboot the development server automatically when assets or configuration changes.

---

## 🛠️ Prerequisites

Before you start, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/) (Optional, but recommended for fast installation) or `npm`

---

## 🚀 Getting Started

### 1. Install Dependencies
In your terminal, navigate to this project directory and install the packages:

```bash
# Using bun (recommended)
bun install

# Or using npm
npm install
```

### 2. Start the Local Server
Launch the local Vite server:

```bash
# Using bun
bun run dev

# Or using npm
npm run dev
```

Once running, you will see a local URL such as:
`⚡ https://localhost:5173/`

> [!IMPORTANT]
> **SSL Certificate Trust**
> The first time you run the server, `vite-plugin-mkcert` will request permission to install a local Certificate Authority (CA) so that `https://localhost:5173` is trusted. 
> 
> Open `https://localhost:5173` in your browser. If you see a warning screen, click **Advanced** -> **Proceed to localhost (unsafe)** or follow your browser's instructions to trust the local SSL certificate. This is a one-time step necessary for Webflow to load the local scripts.

---

## 🔗 Connecting to Webflow

To connect your Webflow page to this local environment, copy the scripts below and paste them into your Webflow Page Settings.

### A. Local Development Mode (For active coding)
Paste this in the **Before `</body>` tag** custom code section of your Webflow page:

```html
<!-- Vite HMR Client (Required for hot-reloading) -->
<script type="module" src="https://localhost:5173/@vite/client"></script>

<!-- Your entry script file -->
<script type="module" src="https://localhost:5173/src/main.js"></script>
```

*(Optional)* If you also have custom CSS inside `src/style.css`, paste this in the **Inside `<head>` tag** section:
```html
<link rel="stylesheet" href="https://localhost:5173/src/style.css" />
```

---

### B. Smart Loader (Automated Dev/Prod Switch)
Instead of manually switching scripts when publishing, you can use a smart conditional loader that detects whether you want to run in local dev mode or load production assets.

Paste this in your Webflow page's **Before `</body>` tag**:

```html
<script>
  // Edit these variables for your production deployment
  const PROD_JS_URL = "https://cdn.jsdelivr.net/gh/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME@latest/dist/js/index.js";
  const PROD_CSS_URL = "https://cdn.jsdelivr.net/gh/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME@latest/dist/css/style.css";
  const LOCAL_DEV_URL = "https://localhost:5173";

  // Check if '?dev=true' is in the URL, or if we want local mode on Webflow staging
  const isDevMode = new URLSearchParams(window.location.search).has('dev') || window.location.hostname.includes('webflow.io');

  if (isDevMode) {
    // 1. Inject Vite client for HMR
    const viteClient = document.createElement('script');
    viteClient.type = 'module';
    viteClient.src = `${LOCAL_DEV_URL}/@vite/client`;
    document.body.appendChild(viteClient);

    // 2. Inject Local JS
    const localScript = document.createElement('script');
    localScript.type = 'module';
    localScript.src = `${LOCAL_DEV_URL}/src/main.js`;
    document.body.appendChild(localScript);

    // 3. Inject Local CSS
    const localStyle = document.createElement('link');
    localStyle.rel = 'stylesheet';
    localStyle.href = `${LOCAL_DEV_URL}/src/style.css`;
    document.head.appendChild(localStyle);

    console.log("🛠️ Webflow Dev Starter: Loaded in LOCAL DEV MODE");
  } else {
    // Load production builds
    const prodScript = document.createElement('script');
    prodScript.type = 'module';
    prodScript.src = PROD_JS_URL;
    document.body.appendChild(prodScript);

    const prodStyle = document.createElement('link');
    prodStyle.rel = 'stylesheet';
    prodStyle.href = PROD_CSS_URL;
    document.head.appendChild(prodStyle);

    console.log("🚀 Webflow Dev Starter: Loaded in PRODUCTION MODE");
  }
</script>
```
or

```html
<script>
  const PROD_JS_URL = "https://cdn.jsdelivr.net/gh/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME@latest/dist/js/index.js";
  const LOCAL_DEV_URL = 'https://localhost:5173';

  function loadModule(src) {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = src;
    document.head.appendChild(script);
  }

  const isDevMode = new URLSearchParams(window.location.search).has('dev');

  if (isDevMode) {
    loadModule(`${LOCAL_DEV_URL}/@vite/client`);
    loadModule(`${LOCAL_DEV_URL}/src/main.js`);
    console.log('🛠️ Loaded in LOCAL DEV MODE (?dev=true)');
  } else {
    loadModule(PROD_JS_URL);
    console.log('🚀 Loaded in PRODUCTION MODE');
  }
</script>
```

---

## 📂 Project Structure

```text
├── dist/                  # Minified bundle output (created after build)
│   ├── assets/css         # Output CSS files
│   ├── assets/img         # Output Image files
│   └── index.js           # Output JS files
├── public/                # Static assets (copied directly to dist root)
├── src/
│   ├── assets/            # Fonts, images, SVGs, or 3D models (.glb/.gltf)
│   ├── utils/             # JavaScript helper utilities
│   │   └── counter.js     # Sample JS helper function
│   ├── main.js            # Entry JS file for your project
│   └── style.css          # Core stylesheet containing custom styles
├── package.json           # Scripts and devDependencies
└── vite.config.js         # Configuration for HTTPS, CORS, and build paths
```

---

## 📦 Production Build & Deployment

When your project is ready for production, compile the code to generate optimized, minified bundles:

```bash
# Using bun
bun run build

# Or using npm
npm run build
```

This creates a `dist/` directory with production-ready assets.

### Recommended Deployment Options
1. **GitHub + jsDelivr (Free & Easy):**
   Push your `dist/` folder to a public GitHub repository. You can then reference your files via jsDelivr CDN:
   - JS: `https://cdn.jsdelivr.net/gh/USERNAME/REPO_NAME@latest/dist/js/index.js`
   - CSS: `https://cdn.jsdelivr.net/gh/USERNAME/REPO_NAME@latest/dist/css/style.css`
2. **Netlify / Vercel / AWS S3:**
   Deploy the `dist/` directory as a static website and reference the deployed HTTPS URL inside Webflow.
