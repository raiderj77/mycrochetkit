#!/bin/bash
# Ralph - Autonomous Story Runner
# Spawns fresh AI instances to work through user stories one at a time

set -e

MAX_ITERATIONS=${1:-10}
ITERATION=0

echo "🤖 Ralph starting with max $MAX_ITERATIONS iterations"

# Check required files exist
if [ ! -f "prd.json" ]; then
    echo "❌ Error: prd.json not found. Run PRD skill first."
    exit 1
fi

if [ ! -f "scripts/ralph/prompt.md" ]; then
    echo "❌ Error: scripts/ralph/prompt.md not found."
    exit 1
fi

# Create progress.txt if it doesn't exist
touch progress.txt

# Get branch name from PRD and create feature branch
BRANCH_NAME=$(cat prd.json | jq -r '.branchName // "feature/ralph-run"')
CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" != "$BRANCH_NAME" ]; then
    echo "📌 Creating/switching to branch: $BRANCH_NAME"
    git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"
fi

while [ $ITERATION -lt $MAX_ITERATIONS ]; do
    ITERATION=$((ITERATION + 1))
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔄 Iteration $ITERATION of $MAX_ITERATIONS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Check if all stories are complete
    INCOMPLETE=$(cat prd.json | jq '[.userStories[] | select(.passes == false)] | length')
    
    if [ "$INCOMPLETE" -eq 0 ]; then
        echo ""
        echo "✅ All stories complete!"
        echo "<promise>COMPLETE</promise>"
        exit 0
    fi
    
    echo "📋 $INCOMPLETE stories remaining"
    
    # Get next story to work on (highest priority where passes == false)
    NEXT_STORY=$(cat prd.json | jq -r '[.userStories[] | select(.passes == false)] | sort_by(.priority) | first | .id')
    NEXT_TITLE=$(cat prd.json | jq -r --arg id "$NEXT_STORY" '.userStories[] | select(.id == $id) | .title')
    
    echo "🎯 Working on: $NEXT_TITLE (ID: $NEXT_STORY)"
    
    # Read the prompt template
    PROMPT=$(cat scripts/ralph/prompt.md)
    
    # Run the AI agent (this is where you'd integrate with your AI tool)
    # For now, this creates a placeholder for manual or tool-specific integration
    echo ""
    echo "📝 Story Details:"
    cat prd.json | jq --arg id "$NEXT_STORY" '.userStories[] | select(.id == $id)'
    echo ""
    
    # Placeholder: In a real setup, you'd call your AI agent here
    # Example: amp --prompt "$PROMPT" --context "prd.json,progress.txt"
    
    echo "⏳ Waiting for AI agent to complete story..."
    echo "   (In production, this would spawn the AI agent)"
    
    # For demonstration, we'll pause here
    # Remove this read statement when integrating with actual AI agent
    read -p "Press Enter after completing story manually, or Ctrl+C to stop..."
    
    # Run quality checks
    echo ""
    echo "🔍 Running quality checks..."
    
    # TypeScript check
    if npm run build 2>/dev/null; then
        echo "  ✅ Build passed"
        BUILD_PASSED=true
    else
        echo "  ❌ Build failed"
        BUILD_PASSED=false
    fi
    
    # If checks pass, commit and update prd.json
    if [ "$BUILD_PASSED" = true ]; then
        echo ""
        echo "💾 Committing changes..."
        git add -A
        git commit -m "feat: complete story $NEXT_STORY - $NEXT_TITLE" || true
        
        # Update prd.json to mark story as complete
        cat prd.json | jq --arg id "$NEXT_STORY" '(.userStories[] | select(.id == $id) | .passes) = true' > prd.json.tmp
        mv prd.json.tmp prd.json
        
        echo "📝 Updating progress.txt..."
        echo "" >> progress.txt
        echo "=== Iteration $ITERATION - $(date) ===" >> progress.txt
        echo "Completed: $NEXT_TITLE" >> progress.txt
        echo "Story ID: $NEXT_STORY" >> progress.txt
        
        git add prd.json progress.txt
        git commit -m "chore: mark story $NEXT_STORY as complete" || true
    else
        echo ""
        echo "⚠️ Quality checks failed. Story not marked complete."
        echo "   Fix the issues and try again in next iteration."
        
        echo "" >> progress.txt
        echo "=== Iteration $ITERATION - $(date) ===" >> progress.txt
        echo "FAILED: $NEXT_TITLE" >> progress.txt
        echo "Reason: Build/tests failed" >> progress.txt
    fi
done

echo ""
echo "⏱️ Max iterations ($MAX_ITERATIONS) reached"
echo "   Run again to continue: ./scripts/ralph/ralph.sh"
