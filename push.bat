@echo off
setlocal

echo.
echo ========================================
echo        GitHub Push Helper
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Checking Git repository...
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: This folder is not a Git repository.
    echo.
    pause
    exit /b 1
)

echo.
echo [2/5] Current changes:
echo ----------------------------------------
git status
echo ----------------------------------------
echo.

echo [3/5] Adding changes...
git add .

if errorlevel 1 (
    echo.
    echo ERROR: git add failed.
    pause
    exit /b 1
)

echo.
echo [4/5] Creating commit...
set /p "MESSAGE=Enter commit message: "

if "%MESSAGE%"=="" (
    set "MESSAGE=Update project"
)

git commit -m "%MESSAGE%"

if errorlevel 1 (
    echo.
    echo No commit was created.
    echo This may mean there were no changes to commit.
    echo.
    pause
    exit /b 1
)

echo.
echo [5/5] Pushing to GitHub...
git push

if errorlevel 1 (
    echo.
    echo ========================================
    echo PUSH FAILED
    echo ========================================
    echo.
    echo Git could not push your changes.
    echo Check the error above.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo       SUCCESS - Pushed to GitHub
echo ========================================
echo.

pause