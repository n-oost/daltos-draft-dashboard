# Daltos Draft Board 2025

A retro-themed, local-first NFL Draft Dashboard built for the **Yogscast / Daltos** community.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-green.svg)

## 🚀 Access the App

| Platform | Link |
| :--- | :--- |
| **Web Browser** | [**Click Here to Open**](https://n-oost.github.io/daltos-draft-dashboard/) |
| **Windows Desktop** | [**Download Installer (.exe)**](https://github.com/n-oost/daltos-draft-dashboard/releases/latest) |

---

## ✨ Features

*   **Retro Aesthetic:** Styled with "Press Start 2P" and "VT323" fonts, featuring a deep purple and gold color scheme.
*   **Local Persistence:** All data is stored locally in your browser/app using IndexedDB (Dexie.js). No account required.
*   **Auto-Visuals:** The app attempts to automatically detect player appearances (Skin Tone, Hair) based on a master database.
*   **Multi-Year Support:** Manage draft boards for 2025, 2026, and beyond.
*   **Pixel Avatars:** Procedurally generated 8-bit avatars for every prospect.

## 🛠️ Development

### Prerequisites
*   Node.js (v20+)
*   Rust (for desktop builds)

### Commands

```bash
# Install dependencies
npm install

# Run web version locally
npm run dev

# Run desktop version locally
npm run desktop

# Build for production
npm run build
```

## 🏗️ Built With

*   [React 19](https://react.dev/)
*   [Vite](https://vitejs.dev/)
*   [Tailwind CSS v4](https://tailwindcss.com/)
*   [Tauri v2](https://tauri.app/)
*   [Dexie.js](https://dexie.org/)