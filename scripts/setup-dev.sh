#!/bin/bash
# Wotanzeroday Gungnir - Development Setup
# Author: Pablo Bobadilla - SOC L3

echo "🏹 Setting up Gungnir Development Environment..."
echo "=============================================="

# Install dependencies
./scripts/install.sh

# Setup git hooks (optional)
if [ -d ".git" ]; then
    echo "🔧 Setting up git hooks..."
    
    # Pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🏹 Running pre-commit checks..."
npm run test -- --watchAll=false
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Commit aborted."
    exit 1
fi
echo "✅ All checks passed"
EOF

    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooks configured"
fi

echo "🎯 Development environment ready!"
echo "Run: npm start"
