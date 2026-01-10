#!/bin/bash

# MyCrochetKit Environment Diagnostic
# Run this anytime things feel broken: bash check-setup.sh

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║           MyCrochetKit Environment Diagnostic                      ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
    fi
}

# 1. Git Setup
echo "🔍 Checking Git..."
git --version > /dev/null 2>&1
check "Git installed"

if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Git repository initialized"
    REPO_URL=$(git config --get remote.origin.url)
    echo "  📍 Remote: $REPO_URL"
    
    BRANCH=$(git branch --show-current)
    echo "  🌿 Current branch: $BRANCH"
    
    git diff --quiet
    if [ $? -eq 0 ]; then
        echo -e "  ${GREEN}✓${NC} No uncommitted changes"
    else
        echo -e "  ${YELLOW}⚠${NC} You have uncommitted changes"
        git status --short
    fi
else
    echo -e "${RED}✗${NC} Not in a git repository"
    echo "  Run: cd ~/mycrochetkit"
fi

echo ""

# 2. Firebase CLI
echo "🔍 Checking Firebase CLI..."
firebase --version > /dev/null 2>&1
check "Firebase CLI installed"

if command -v firebase > /dev/null; then
    FIREBASE_PROJECT=$(firebase use 2>&1 | grep "Active" | awk '{print $4}')
    if [ ! -z "$FIREBASE_PROJECT" ]; then
        echo -e "${GREEN}✓${NC} Active project: $FIREBASE_PROJECT"
    else
        echo -e "${YELLOW}⚠${NC} No active Firebase project"
        echo "  Run: firebase use my-crochetkit"
    fi
fi

echo ""

# 3. Node.js & npm
echo "🔍 Checking Node.js..."
node --version > /dev/null 2>&1
check "Node.js installed"
node --version | xargs echo "  Version:"

npm --version > /dev/null 2>&1
check "npm installed"
npm --version | xargs echo "  Version:"

echo ""

# 4. Project Structure
echo "🔍 Checking Project Structure..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json found"
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✓${NC} node_modules exists"
    else
        echo -e "${YELLOW}⚠${NC} node_modules missing - run: npm install"
    fi
else
    echo -e "${RED}✗${NC} package.json not found"
    echo "  Are you in the project directory?"
fi

if [ -f "firebase.json" ]; then
    echo -e "${GREEN}✓${NC} firebase.json found"
else
    echo -e "${RED}✗${NC} firebase.json not found"
fi

if [ -d "dist" ]; then
    echo -e "${GREEN}✓${NC} dist/ folder exists (last build present)"
    FILE_COUNT=$(find dist -type f | wc -l)
    echo "  Files in dist/: $FILE_COUNT"
else
    echo -e "${YELLOW}⚠${NC} dist/ folder missing - run: npm run build"
fi

echo ""

# 5. Environment Files
echo "🔍 Checking Environment Files..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env exists"
else
    echo -e "${YELLOW}⚠${NC} .env not found"
fi

if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local exists"
else
    echo -e "${YELLOW}⚠${NC} .env.local not found"
fi

if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✓${NC} .gitignore exists"
    if grep -q ".env.local" .gitignore; then
        echo -e "  ${GREEN}✓${NC} .env.local is gitignored (safe)"
    else
        echo -e "  ${RED}✗${NC} .env.local NOT gitignored (DANGER!)"
    fi
else
    echo -e "${YELLOW}⚠${NC} .gitignore not found"
fi

echo ""

# 6. Cloud Build Status
echo "🔍 Checking Cloud Build..."
echo "  Manual check required:"
echo "  https://console.cloud.google.com/cloud-build/triggers?project=my-crochetkit"
echo ""
echo "  ✓ Verify 'deploy-site' trigger is ENABLED"
echo "  ✓ Verify it's watching: raiderj77/mycrochetkit"
echo "  ✓ Verify Event: 'Push to branch' -> 'main'"

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Summary
echo "📋 Summary:"
echo ""
if [ -d ".git" ] && command -v firebase > /dev/null && [ -f "package.json" ]; then
    echo -e "${GREEN}✓ Core setup looks good!${NC}"
    echo ""
    echo "Ready to deploy:"
    echo "  Fast: npm run build && firebase deploy --only hosting"
    echo "  Auto: git add . && git commit -m 'msg' && git push"
else
    echo -e "${RED}⚠ Some issues detected${NC}"
    echo ""
    echo "Common fixes:"
    echo "  • Not in project: cd ~/mycrochetkit"
    echo "  • Missing dependencies: npm install"
    echo "  • Firebase not set: firebase use my-crochetkit"
    echo "  • Git not initialized: git init && git remote add origin https://github.com/raiderj77/mycrochetkit.git"
fi

echo ""
echo "For detailed workflow: cat COMMAND_CHEATSHEET.txt"
