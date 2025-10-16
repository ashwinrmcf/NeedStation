@echo off
echo Fixing secret leak in Git repository...
echo.

REM Remove the file with secrets from Git history
echo Step 1: Removing sensitive files from Git tracking...
git rm --cached Backend/authbackend/.env
git rm --cached Backend/authbackend/.env.production

REM Add to gitignore if not already there
echo Step 2: Ensuring .env files are in .gitignore...
echo .env >> .gitignore
echo .env.* >> .gitignore

REM Commit the changes
echo Step 3: Committing changes...
git add .gitignore
git commit -m "Remove sensitive .env files from Git tracking"

echo.
echo ✅ Done! Now you can push safely.
echo.
echo IMPORTANT: Regenerate your Google OAuth credentials at:
echo https://console.cloud.google.com/apis/credentials
echo.
pause
