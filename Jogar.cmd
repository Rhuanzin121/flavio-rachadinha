@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale Node.js 22.12 ou superior para jogar.
  pause
  exit /b 1
)
echo Abrindo o jogo. Para encerrar, pressione Ctrl+C nesta janela.
start "" "http://127.0.0.1:4173"
node serve.mjs
pause
