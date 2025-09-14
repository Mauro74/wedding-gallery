# Karen & Maurizio Wedding Gallery - Setup Guide

## Prerequisites

You need to install Node.js and npm to run this React application.

### Install Node.js

1. **Download Node.js** from [https://nodejs.org/](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version
   - Recommended version: 18.x or higher

2. **Verify Installation**
   ```bash
   node --version
   npm --version
   ```

## Quick Setup

Once Node.js is installed, run the setup script:

```bash
./install-deps.sh
```

Or manually install dependencies:

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3002**

## Current Issues Fixed

✅ Fixed import statements (removed .tsx extensions)
✅ Created proper project structure
✅ Added TypeScript configuration
✅ Created installation scripts

## What the App Includes

- **Full-screen photo gallery** with tiled thumbnails
- **Modal lightbox** for viewing full-size images  
- **Keyboard navigation** (arrow keys, escape)
- **Click navigation** arrows on image sides
- **Responsive design** for all devices
- **Beautiful wedding theme** with elegant styling

## Troubleshooting

If you see TypeScript errors about missing modules:
1. Make sure Node.js is installed
2. Run `npm install` to install dependencies
3. Restart your IDE/editor

The errors you're seeing are because the React and styled-components dependencies haven't been installed yet.
