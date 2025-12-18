#!/bin/bash
set -e  # Exit on any error

echo "🔨 Building application..."
npm run build

echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "📦 Staging changes for git..."
git add .

echo "💾 Committing changes..."
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"

echo "📤 Pushing to GitHub..."
git push

echo "✅ Deployment complete!"
