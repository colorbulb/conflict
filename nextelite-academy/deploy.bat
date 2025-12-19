@echo off
setlocal enabledelayedexpansion

echo 🔨 Building application...
call npm run build
if errorlevel 1 (
    echo Build failed!
    exit /b 1
)

echo 🚀 Deploying to Firebase Hosting...
call firebase deploy --only hosting
if errorlevel 1 (
    echo Firebase deploy failed!
    exit /b 1
)

echo 📦 Staging changes for git...
call git add .

echo 💾 Committing changes...
for /f "tokens=*" %%a in ('powershell -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"') do set TIMESTAMP=%%a
call git commit -m "Deploy: !TIMESTAMP!" || echo No changes to commit

echo 📤 Pushing to GitHub...
call git push
if errorlevel 1 (
    echo Git push failed!
    exit /b 1
)

echo ✅ Deployment complete!

