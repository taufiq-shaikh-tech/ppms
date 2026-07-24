# PPMS – Patient & Practice Management System

PPMS is a modern, responsive healthcare web application built with **React, Vite, and Tailwind CSS**, designed for doctor and patient-facing workflows with a clean, production-ready frontend.

---

## 🚀 Tech Stack

- **Frontend:** React + Vite (fast dev server, HMR)
- **Styling:** Tailwind CSS (utility-first, responsive design)
- **Tooling:** ESLint, PostCSS
- **Build & Dev:** Vite (optimized bundling, lightning-fast builds)

---

## ✨ Features

- Responsive landing page with doctor-focused visuals.
- Clean, modern home page layout for healthcare use cases.
- Fixed and optimized image paths tailored for Netlify deployment.
- Component-based UI architecture for better maintainability.
- Production-ready React + Vite + Tailwind setup.

---

## 📂 Project Structure

```text
ppms/
├─ ppms-server/        # Backend / server code (if enabled)
├─ public/             # Static assets and images
├─ src/                # React components, pages, and app logic
├─ tailwind.config.js  # Tailwind CSS configuration
├─ postcss.config.js   # PostCSS + Tailwind pipeline
├─ vite.config.js      # Vite config (dev & build)
├─ eslint.config.js    # ESLint setup for code quality
└─ package.json        # Project scripts & dependencies
```

---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/taufiq-shaikh-tech/ppms.git
cd ppms
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Run in development mode

```bash
npm run dev
```

App will be available at:

```text
http://localhost:5173
```

### 4. Build for production

```bash
npm run build
```

The production build is generated in the `dist/` folder.

### 5. Preview production build

```bash
npm run preview
```

---

## 🌐 Deployment (Netlify)

PPMS is configured to work smoothly on **Netlify**, including image paths and static asset handling.[web:23][web:27][web:30]

**Basic steps:**

1. Push your code to GitHub.  
2. Create a new site on Netlify and connect this repository.  
3. Use these settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy and verify that all images and pages work correctly.

(Optional) Add a `netlify.toml` for consistent builds:

```toml
[build]
command = "npm run build"
publish = "dist"
[build.environment]
NODE_VERSION = "18"
```

---

## 🧹 Code Quality & ESLint

This project uses **ESLint** to keep the codebase clean and consistent.  
Run linting with:

```bash
npm run lint
```

For larger, production-grade applications, consider adding **TypeScript** and type-aware lint rules using `typescript-eslint`.[web:14][web:17][web:20]

---

## 🔮 React Compiler (Optional)

The **React Compiler** is not enabled by default to keep dev and build performance fast.  
If you want to experiment with it, follow the official React docs:[web:12][web:19]

- [React Compiler Installation Guide](https://react.dev/learn/react-compiler/installation)

---

## 🎯 Project Goals

- Deliver a modern, responsive UI for healthcare workflows.
- Maintain a clean, extensible React + Vite + Tailwind codebase.
- Make deployment simple and reliable for platforms like Netlify.
- Serve as a base for future doctor/patient management features.

---

## 🙋‍♂️ Author

Built by **[Taufiq Shaikh](https://github.com/taufiq-shaikh-tech)**  
AI Engineer & Full-Stack Developer focused on production-ready systems.

> _"Keep learning. Keep building. Keep shipping."_ 🚀
