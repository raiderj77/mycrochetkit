# MyCrochetKit Environment Diagnostic (PowerShell)
# Run: .\check-setup.ps1

Write-Host "`n╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           MyCrochetKit Environment Diagnostic                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# 1. Git Setup
Write-Host "🔍 Checking Git..." -ForegroundColor Yellow
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if ($gitInstalled) {
    Write-Host "✓ Git installed" -ForegroundColor Green
    $gitVer = git --version
    Write-Host "  Version: $gitVer" -ForegroundColor Gray
    
    if (Test-Path ".git") {
        Write-Host "✓ Git repository initialized" -ForegroundColor Green
        $remote = git config --get remote.origin.url
        Write-Host "  📍 Remote: $remote" -ForegroundColor Gray
        $branch = git branch --show-current
        Write-Host "  🌿 Current branch: $branch" -ForegroundColor Gray
        
        $changes = git status --short
        if ($changes) {
            Write-Host "  ⚠ You have uncommitted changes" -ForegroundColor Yellow
        }
        else {
            Write-Host "  ✓ No uncommitted changes" -ForegroundColor Green
        }
    }
    else {
        Write-Host "✗ Not in a git repository" -ForegroundColor Red
    }
}
else {
    Write-Host "✗ Git not installed" -ForegroundColor Red
}

Write-Host ""

# 2. Firebase CLI
Write-Host "🔍 Checking Firebase CLI..." -ForegroundColor Yellow
$fbInstalled = Get-Command firebase -ErrorAction SilentlyContinue
if ($fbInstalled) {
    Write-Host "✓ Firebase CLI installed" -ForegroundColor Green
    $fbVer = firebase --version
    Write-Host "  Version: $fbVer" -ForegroundColor Gray
    
    $fbProject = firebase use 2>&1 | Select-String "Active" | Out-String
    if ($fbProject) {
        Write-Host "✓ Firebase project configured" -ForegroundColor Green
        Write-Host "  $($fbProject.Trim())" -ForegroundColor Gray
    }
    else {
        Write-Host "⚠ No active Firebase project" -ForegroundColor Yellow
        Write-Host "  Run: firebase use my-crochetkit" -ForegroundColor Gray
    }
}
else {
    Write-Host "✗ Firebase CLI not installed" -ForegroundColor Red
    Write-Host "  Install: npm install -g firebase-tools" -ForegroundColor Gray
}

Write-Host ""

# 3. Node.js & npm
Write-Host "🔍 Checking Node.js..." -ForegroundColor Yellow
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if ($nodeInstalled) {
    Write-Host "✓ Node.js installed" -ForegroundColor Green
    $nodeVer = node --version
    Write-Host "  Version: $nodeVer" -ForegroundColor Gray
}
else {
    Write-Host "✗ Node.js not installed" -ForegroundColor Red
}

$npmInstalled = Get-Command npm -ErrorAction SilentlyContinue
if ($npmInstalled) {
    Write-Host "✓ npm installed" -ForegroundColor Green
    $npmVer = npm --version
    Write-Host "  Version: $npmVer" -ForegroundColor Gray
}
else {
    Write-Host "✗ npm not installed" -ForegroundColor Red
}

Write-Host ""

# 4. Project Structure
Write-Host "🔍 Checking Project Structure..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✓ package.json found" -ForegroundColor Green
    
    if (Test-Path "node_modules") {
        Write-Host "✓ node_modules exists" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ node_modules missing - run: npm install" -ForegroundColor Yellow
    }
}
else {
    Write-Host "✗ package.json not found" -ForegroundColor Red
}

if (Test-Path "firebase.json") {
    Write-Host "✓ firebase.json found" -ForegroundColor Green
}
else {
    Write-Host "✗ firebase.json not found" -ForegroundColor Red
}

if (Test-Path "dist") {
    Write-Host "✓ dist/ folder exists" -ForegroundColor Green
    $fileCount = (Get-ChildItem -Path "dist" -Recurse -File -ErrorAction SilentlyContinue).Count
    Write-Host "  Files in dist/: $fileCount" -ForegroundColor Gray
}
else {
    Write-Host "⚠ dist/ folder missing - run: npm run build" -ForegroundColor Yellow
}

Write-Host ""

# 5. Environment Files
Write-Host "🔍 Checking Environment Files..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .env exists" -ForegroundColor Green
}
else {
    Write-Host "⚠ .env not found" -ForegroundColor Yellow
}

if (Test-Path ".env.local") {
    Write-Host "✓ .env.local exists" -ForegroundColor Green
}
else {
    Write-Host "⚠ .env.local not found" -ForegroundColor Yellow
}

if (Test-Path ".gitignore") {
    Write-Host "✓ .gitignore exists" -ForegroundColor Green
    $gitignore = Get-Content ".gitignore" -Raw
    if ($gitignore -match "\.env\.local") {
        Write-Host "  ✓ .env.local is gitignored (safe)" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ .env.local NOT gitignored (DANGER!)" -ForegroundColor Red
    }
}
else {
    Write-Host "⚠ .gitignore not found" -ForegroundColor Yellow
}

Write-Host ""

# 6. Cloud Build
Write-Host "🔍 Cloud Build Status..." -ForegroundColor Yellow
Write-Host "  Manual check: https://console.cloud.google.com/cloud-build/triggers?project=my-crochetkit" -ForegroundColor Cyan
Write-Host "  ✓ Verify deploy-site trigger is ENABLED" -ForegroundColor Gray
Write-Host "  ✓ Verify watching: raiderj77/mycrochetkit" -ForegroundColor Gray

Write-Host "`n════════════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Summary
Write-Host "📋 Summary:`n" -ForegroundColor Cyan

$gitOk = Test-Path ".git"
$fbOk = Get-Command firebase -ErrorAction SilentlyContinue
$pkgOk = Test-Path "package.json"

if ($gitOk -and $fbOk -and $pkgOk) {
    Write-Host "✓ Core setup looks good!`n" -ForegroundColor Green
    Write-Host "Ready to deploy:" -ForegroundColor White
    Write-Host "  Fast: npm run build; firebase deploy --only hosting" -ForegroundColor Cyan
    Write-Host "  Auto: git add .; git commit -m 'msg'; git push`n" -ForegroundColor Cyan
}
else {
    Write-Host "⚠ Some issues detected`n" -ForegroundColor Yellow
    Write-Host "Common fixes:" -ForegroundColor White
    Write-Host "  • Not in project: cd ~\OneDrive\Desktop\crochetkit\mycrochetkit" -ForegroundColor Gray
    Write-Host "  • Missing dependencies: npm install" -ForegroundColor Gray
    Write-Host "  • Firebase not set: firebase use my-crochetkit`n" -ForegroundColor Gray
}

Write-Host "For detailed workflow: Get-Content COMMAND_CHEATSHEET.txt" -ForegroundColor Gray
