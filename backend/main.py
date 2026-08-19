"""
main.py — Application entry point for Y4D Community Help & Resource Hub.

Responsibilities:
- Create and configure the FastAPI application.
- Register CORS middleware.
- Register all routers.
- Register global exception handlers for application-level errors.
- Expose health-check endpoints outside the /api/v1 prefix.
"""

from __future__ import annotations

import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from core.exceptions import DuplicateError, NotFoundError
from database import engine
from routers import media, requests, users, volunteers

# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Y4D Community Help & Resource Hub API",
    description="Backend API for the Y4D hackathon project.",
    version="0.1.0",
)

# ---------------------------------------------------------------------------
# CORS — allow local React dev server; move origin to env var before deploy
# ---------------------------------------------------------------------------

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Global exception handlers
# ---------------------------------------------------------------------------


@app.exception_handler(NotFoundError)
async def not_found_handler(request: Request, exc: NotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": exc.detail})


@app.exception_handler(DuplicateError)
async def duplicate_handler(request: Request, exc: DuplicateError) -> JSONResponse:
    return JSONResponse(status_code=409, content={"detail": exc.detail})


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(requests.router, prefix="/api/v1/requests", tags=["Requests"])
app.include_router(volunteers.router, prefix="/api/v1/requests", tags=["Volunteers"])
app.include_router(media.router, prefix="/api/v1/requests", tags=["Media"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])

# ---------------------------------------------------------------------------
# Health endpoints (outside /api/v1 prefix intentionally)
# ---------------------------------------------------------------------------


@app.get("/health", tags=["Health"])
def health() -> dict:
    return {"status": "ok"}


@app.get("/health/db", tags=["Health"])
def health_db() -> dict:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        return {"database": "connected", "result": result.scalar()}