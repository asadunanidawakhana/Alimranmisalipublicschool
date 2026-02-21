@echo off
setlocal enabledelayedexpansion

echo.
echo =======================================
echo    AL IMRAN AUTO-PUSH TO GITHUB
echo =======================================
echo.

:: Check if git is installed
where git >nul 2>0
if %errorlevel% neq 0 (
    echo [ERROR] Git install nahi he! Pehle Git install karein.
    pause
    exit /b
)

echo [1/3] Files stage ho rahi hain...
git add .

:: Get current date and time for commit message
set "commit_msg=Auto update: %date% %time%"

echo [2/3] Commit ho raha he: "!commit_msg!"
git commit -m "!commit_msg!"

:: Check if there's anything to commit
if %errorlevel% neq 0 (
    echo [INFO] Stage karne ke liye koi nayi tabdili nahi mili.
) else (
    echo [3/3] GitHub par push ho raha he...
    git push origin main
    
    if %errorlevel% eq 0 (
        echo.
        echo =======================================
        echo    SUCCESS: Kamyabi se push ho gaya!
        echo =======================================
    ) else (
        echo.
        echo [ERROR] Push nahi ho saka. Check karein ke internet he ya nahi.
    )
)

echo.
pause
