# MyCrochetKit Bash Aliases
# Add these to your ~/.bashrc or ~/.bash_aliases file
# Then run: source ~/.bashrc

# Navigation
alias proj='cd ~/mycrochetkit'
alias mykit='cd ~/mycrochetkit'

# Quick Deploy Workflows
alias fastdeploy='npm run build && firebase deploy --only hosting'
alias deploy='fastdeploy'
alias quickdeploy='fastdeploy'

# Git Shortcuts
alias pushit='git add . && git commit -m "WIP: Quick save" && git push origin main'
alias gitsave='git add . && git commit -m "Save progress" && git push'
alias gitstatus='git status'
alias gs='git status'
alias gitlog='git log --oneline -10'

# Firebase Shortcuts
alias fblogin='firebase login'
alias fbuse='firebase use my-crochetkit'
alias fbprojects='firebase projects:list'

# Combined Workflows
alias testdeploy='npm run build && firebase deploy --only hosting && echo "✓ Deployed to https://my-crochetkit.web.app"'
alias releasedeploy='git add . && git commit -m "Release" && git push origin main && echo "✓ Pushed to GitHub - Cloud Build will deploy in 2-3 min"'

# Development
alias dev='npm run dev'
alias build='npm run build'
alias install='npm install'

# Diagnostic
alias checksetup='bash ~/mycrochetkit/check-setup.sh'
alias diagnose='checksetup'

# Environment Management
alias useprod='firebase use my-crochetkit && echo "Using PRODUCTION project"'
alias usestaging='firebase use my-crochetkit-staging && echo "Using STAGING project"'

# Emergency Commands
alias hardrefresh='git fetch origin && git reset --hard origin/main && echo "⚠ Reset to match GitHub exactly"'
alias undolast='git reset --soft HEAD~1 && echo "✓ Last commit undone (changes kept)"'

# Helpful Reminders
alias workflow='cat ~/mycrochetkit/COMMAND_CHEATSHEET.txt'
alias commands='cat ~/mycrochetkit/COMMAND_CHEATSHEET.txt'

# Most Common Daily Flow (one command!)
alias workstart='cd ~/mycrochetkit && git pull origin main && npm install && echo "✓ Ready to work!"'
alias workend='git add . && git commit -m "End of session" && git push origin main && echo "✓ Session saved to GitHub"'

# ════════════════════════════════════════════════════════════════
# INSTALLATION INSTRUCTIONS
# ════════════════════════════════════════════════════════════════
#
# 1. Copy this entire file content
#
# 2. In your Antigravity terminal, run:
#    nano ~/.bash_aliases
#
# 3. Paste the content, save (Ctrl+X, Y, Enter)
#
# 4. Activate the aliases:
#    source ~/.bashrc
#
# 5. Test it:
#    proj           (should navigate to your project)
#    checksetup     (should run diagnostic)
#    commands       (should show quick reference)
#
# ════════════════════════════════════════════════════════════════

# USAGE EXAMPLES:
#
# Morning:
#   workstart
#
# Quick test:
#   deploy
#
# End of day:
#   workend
#
# Check status:
#   gs
#
# Emergency reset:
#   hardrefresh
#
# ════════════════════════════════════════════════════════════════
