#!/bin/bash
# Wotanzeroday Gungnir - Deployment Script
# Author: Pablo Bobadilla - SOC L3

echo "🏹 Deploying Gungnir to Production..."
echo "====================================="

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if serve is installed
if ! command -v serve &> /dev/null; then
    echo "📦 Installing serve globally..."
    npm install -g serve
fi

# Deploy
echo "🚀 Starting Gungnir server..."
echo "Server will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

serve -s build -l 3000
