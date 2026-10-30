@echo off
title Subiendo proyecto TAGHER'S a GitHub...
echo ========================================================
echo   TAGHER'S STREETWEAR - ENVIANDO PROYECTO A GITHUB
echo   Repositorio: https://github.com/erickflores123hz-bit/THAGERS
echo ========================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   EXITO: Tu proyecto fue subido correctamente a GitHub!
    echo ========================================================
) else (
    echo ========================================================
    echo   Hubo un detalle con la autenticacion de GitHub.
    echo ========================================================
)
echo.
pause
