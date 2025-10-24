# 🏡 Backyard Bud - Setup Guide

## Prerequisites
Make sure you have these installed:
- **Node.js** (version 16 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **Git** (optional, for cloning) - Download from [git-scm.com](https://git-scm.com/)

## Quick Start

### 1. Get the Code
```bash
# If using Git:
git clone [REPOSITORY_URL]
cd backyard-buds

# OR if you have the ZIP file:
# Extract the ZIP file and navigate to the folder
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Start the Application
```bash
# Start both frontend and backend servers
npm run dev
```

### 4. Open in Browser
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🎉 That's it!

You should now see the beautiful Backyard Bud application running!

## Troubleshooting

### If ports are already in use:
```bash
# Kill existing processes
pkill -f node

# Then restart
npm run dev
```

### If you get permission errors:
```bash
# On Mac/Linux, you might need:
sudo npm install -g npm@latest
```

### If dependencies fail to install:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## Features to Try

1. **Start Assessment** - Click the button on the homepage
2. **Fill out the form** with sample data:
   - Property Type: Urban
   - Lot Size: 800
   - Structure Type: Shed
   - Height: 3.5
   - Floor Area: 40
   - Distance from Boundary: 2.5
3. **View Results** - See if your project qualifies!

## Project Structure
```
backyard-buds/
├── frontend/          # React app (port 3000)
├── backend/           # API server (port 3001)
├── rules/             # Planning rules
└── README.md          # Full documentation
```

---

**Need help?** Check the main README.md file for detailed documentation!
