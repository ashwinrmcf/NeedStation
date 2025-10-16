@echo off
echo Running sub-services insert script...
echo.

REM Update these variables with your MySQL credentials
set DB_USER=root
set DB_PASSWORD=root
set DB_NAME=needstation_db
set DB_HOST=localhost
set DB_PORT=3306

echo Connecting to MySQL and running insert script...
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < insert_subservices.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Sub-services inserted successfully!
    echo.
    echo You can now test the booking modal - sub-services should appear in Step 2.
) else (
    echo.
    echo ❌ Error inserting sub-services. Please check your database credentials.
)

pause
