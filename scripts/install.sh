#!/bin/bash
# Wotanzeroday Gungnir - Installation Script
# Author: Pablo Bobadilla - SOC L3

echo "🏹 Initializing Wotanzeroday - Gungnir Installation..."
echo "======================================================"

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -c 2- | cut -d. -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ required. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing Gungnir dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create necessary directories
mkdir -p logs
mkdir -p temp
mkdir -p exports

echo "📁 Created necessary directories"

# Set permissions
chmod +x scripts/*.sh

echo "🔐 Set script permissions"

# Installation complete
echo ""
echo "🎯 Wotanzeroday - Gungnir installation completed!"
echo "======================================================"
echo ""
echo "Quick Start Commands:"
echo "  npm start          - Start development server"
echo "  npm run build      - Build for production"
echo "  npm run deploy     - Deploy application"
echo ""
echo "🏹 Ready to hunt zero-days with Gungnir!"
echo "   The spear that never misses its target."
echo ""
echo "Developed by Pablo Bobadilla - SOC L3"
