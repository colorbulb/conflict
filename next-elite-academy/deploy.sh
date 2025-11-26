#!/bin/bash

# Deployment script for Next Elite Academy
# This script builds, deploys to Firebase, and pushes to git

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Step 1: Build the app
echo "📦 Building the app..."
npm run build

# Step 2: Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy --only apphosting

# Step 3: Git operations
echo "📝 Staging all changes..."
git add .

# Step 4: Generate commit message with timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
COMMIT_MSG="Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

echo "💾 Committing changes: $COMMIT_MSG"
git commit -m "$COMMIT_MSG" || {
    echo "⚠️  No changes to commit or commit failed"
}

# Step 5: Push to git
echo "📤 Pushing to git..."
git push origin main || {
    echo "⚠️  Push failed or no changes to push"
}

echo "✅ Deployment complete!"
echo "🌐 Check your app at: https://console.firebase.google.com/project/nextelitefnweb/apphosting"

