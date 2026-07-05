@echo off
chcp 65001 >nul
setlocal

rem Este script inicializa Git (si es necesario) y sube los cambios de viajeasevillaseptiembre al repositorio de GitHub.
rem Se coloca dentro de la raíz del proyecto y funciona haciendo doble clic.

cd /d "%~dp0"

echo ============================================
echo   Subir cambios a GitHub (ccmfalla)
echo ============================================
echo.

rem Verificar si ya se ha inicializado Git
if not exist .git (
    echo [INFO] Inicializando repositorio Git local...
    git init -b master
    echo [INFO] Agregando repositorio remoto Git de GitHub...
    git remote add origin https://github.com/jigomez-gr/viajeasevillaseptiembre.git
)

echo Cambios detectados:
git status -s
echo.

set /p MSG="Describe brevemente el cambio (Enter para mensaje automático): "
if "%MSG%"=="" set MSG=Actualizacion del %date% %time%

git add -A
git commit -m "%MSG%"

echo.
echo Sincronizando con GitHub antes de subir...
git pull --rebase origin master

echo.
echo Subiendo a GitHub...
git push -u origin master

echo.
echo ============================================
echo   Listo.
echo ============================================
pause
