@ECHO OFF
SETLOCAL

REM Check for node.exe in bin (Source environment)
IF EXIST "%~dp0bin\node.exe" (
    SET "NODE_EXE=%~dp0bin\node.exe"
) ELSE (
    REM Check for node.exe in ../bin (Packaged environment)
    IF EXIST "%~dp0..\bin\node.exe" (
        SET "NODE_EXE=%~dp0..\bin\node.exe"
    ) ELSE (
        ECHO Node.exe not found!
        EXIT /B 1
    )
)

"%NODE_EXE%" "%~dp0node_modules\appium\build\lib\main.js" %*

