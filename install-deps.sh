#!/bin/bash

echo "Karen & Maurizio Wedding Gallery - Dependency Installation"
echo "========================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    echo "Recommended version: 18.x or higher"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    echo "Please install npm (usually comes with Node.js)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Dependencies installed successfully!"
    echo ""
    echo "To start the development server, run:"
    echo "  npm run dev"
    echo ""
    echo "The app will be available at: http://localhost:3002"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
