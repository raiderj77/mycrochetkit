# Install all recommended VS Code extensions for My Crochet Kit
# Run this in PowerShell

Write-Host "Installing VS Code extensions for My Crochet Kit..." -ForegroundColor Cyan

$extensions = @(
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "usernamehw.errorlens",
    "dsznajder.es7-react-js-snippets",
    "styled-components.vscode-styled-components",
    "formulahendry.auto-rename-tag",
    "pmneo.tsimporter",
    "bradlc.vscode-tailwindcss",
    "csstools.postcss",
    "toba.vsfire",
    "firebase.vscode-firestore-snippets",
    "deque-systems.vscode-axe-linter",
    "MaxvanderSchee.web-accessibility",
    "ms-vscode.vscode-typescript-next",
    "christian-kohler.path-intellisense",
    "eamodio.gitlens",
    "donjayamanne.githistory",
    "streetsidesoftware.code-spell-checker",
    "wayou.vscode-todo-highlight",
    "gruntfuggly.todo-tree",
    "oderwat.indent-rainbow",
    "yzhang.markdown-all-in-one",
    "bierner.markdown-mermaid",
    "ZainChen.json",
    "ms-vscode.live-server"
)

foreach ($extension in $extensions) {
    Write-Host "Installing: $extension" -ForegroundColor Yellow
    code --install-extension $extension
}

Write-Host "`nAll extensions installed! ✅" -ForegroundColor Green
Write-Host "Restart VS Code to activate all extensions." -ForegroundColor Cyan
