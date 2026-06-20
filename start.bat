@echo off
echo ============================================
echo   Starting Book RAG System
echo ============================================

echo.
echo [1/3] Starting Docker (Redis)...
docker compose up -d

echo.
echo [2/3] Starting Backend (FastAPI)...
start "Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

echo.
echo [3/3] Starting Frontend (React)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo   All services starting...
echo   Backend  -> http://localhost:8000
echo   Frontend -> http://localhost:5173
echo ============================================
pause