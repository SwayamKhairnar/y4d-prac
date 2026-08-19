"""
routers/users.py — HTTP endpoints for user dashboard queries.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.exceptions import NotFoundError
from database import get_db
from schemas import RequestResponse
from services import user_service

router = APIRouter()


@router.get("/{user_id}/requests", response_model=list[RequestResponse])
def get_user_requests(
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> list[RequestResponse]:
    """Return all requests created by the specified user."""
    try:
        requests = user_service.get_user_requests(db, user_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.detail)
    return [RequestResponse.model_validate(r) for r in requests]


@router.get("/{user_id}/volunteering", response_model=list[RequestResponse])
def get_user_volunteering(
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> list[RequestResponse]:
    """Return requests the user has volunteered for."""
    try:
        requests = user_service.get_user_volunteering(db, user_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.detail)
    return [RequestResponse.model_validate(r) for r in requests]
