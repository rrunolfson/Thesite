# Last Mile Website - Complete Download Guide

## Quick Setup (5 minutes)

### Step 1: Create Project Structure

```bash
# Create main folder
mkdir lastmile-website
cd lastmile-website

# Create all folders
mkdir -p src/app/components/ui
mkdir -p src/app/pages
mkdir -p src/app/hooks
mkdir -p src/styles
mkdir -p public
```

### Step 2: Create package.json

Create `package.json` in the root folder with this content:

```json
{
  "name": "lastmile-website",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "0.487.0",
    "react-router": "^7.13.0",
    "clsx": "2.1.1",
    "tailwind-merge": "3.2.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.12",
    "@vitejs/plugin-react": "4.7.0",
    "tailwindcss": "4.1.12",
    "vite": "6.3.5",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Get All Files

Go to Figma Make and copy each file's content:

**Essential Files (copy from Figma Make):**
- `/src/app/App.tsx`
- `/src/app/routes.ts`
- `/src/app/components/Navbar.tsx`
- `/src/app/components/Footer.tsx`
- `/src/app/components/Root.tsx`
- `/src/app/pages/HomePage.tsx`
- `/src/app/pages/WhatWeDoPage.tsx`
- `/src/app/pages/IndustriesPage.tsx`
- `/src/app/pages/PartnersPage.tsx`
- `/src/app/pages/OEMsPage.tsx`
- `/src/app/pages/WhyLastMilePage.tsx`
- `/src/app/pages/CompanyPage.tsx`
- `/src/app/pages/ContactPage.tsx`
- `/src/app/pages/NotFound.tsx`
- `/src/styles/index.css`
- `/src/styles/tailwind.css`
- `/src/styles/theme.css`
- `/src/styles/custom.css`
- `/vite.config.ts`
- `/index.html` (in root)

### Step 5: Create index.html

Create `index.html` in the root with:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Last Mile Inc. - OT Intelligence Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Step 6: Create main.tsx

Create `/src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 7: Run Locally

```bash
npm run dev
```

Visit http://localhost:5173

### Step 8: Push to GitHub

```bash
git init
git add .
git commit -m "Initial Last Mile website"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Need Help?

Ask me to provide the full content of any file listed above!
