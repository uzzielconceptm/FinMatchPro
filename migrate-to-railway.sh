#!/bin/bash

echo "🚀 Migrating FlowBooks Associate from Replit to Railway..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run from project root."
    exit 1
fi

# Check current git status
echo "📊 Checking git status..."
git status

# Add all Railway migration files
echo "📦 Adding Railway deployment files..."
git add migrations/
git add scripts/
git add railway.toml
git add RAILWAY_*.md
git add MIGRATION_WORKFLOW.md
git add DEPLOY_NOW.md
git add .github/workflows/

# Commit Railway setup
echo "💾 Committing Railway deployment setup..."
git commit -m "Add Railway deployment with PostgreSQL migrations

- Complete migration system with automated database updates
- PostgreSQL schema with user authentication and data management
- Railway configuration for automatic deployment
- Comprehensive documentation for database updates
- GitHub Actions workflow for CI/CD"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎯 Next steps for Railway deployment:"
    echo "1. Go to railway.app and sign in with GitHub"
    echo "2. Create new project from: uzzielconceptm/FinMatchPro"
    echo "3. Add PostgreSQL database service"
    echo "4. Configure environment variables:"
    echo "   - DATABASE_URL (from Railway PostgreSQL)"
    echo "   - GMAIL_USER and GMAIL_APP_PASSWORD"
    echo "   - NODE_ENV=production"
    echo ""
    echo "📚 Reference documentation:"
    echo "   - DEPLOY_NOW.md - Step-by-step deployment"
    echo "   - RAILWAY_QUICK_START.md - Railway setup guide"
    echo "   - MIGRATION_WORKFLOW.md - Database update process"
    echo ""
    echo "🌐 Your app will be live at: https://your-app-name.railway.app"
else
    echo "❌ Git push failed. Please check your GitHub credentials and try again."
    exit 1
fi