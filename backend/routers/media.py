"""
routers/media.py — HTTP endpoints for request media attachments.

Accepts media metadata now. Actual S3 upload logic will be added in a
future milestone without requiring changes to this router's interface.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.exceptions import NotFoundError
from database import get_db
from schemas import MediaCreate, MediaResponse
from services import media_service

router = APIRouter()


@router.post(
    "/{request_id}/media",
    response_model=MediaResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_media(
    request_id: uuid.UUID,
    data: MediaCreate,
    db: Session = Depends(get_db),
) -> MediaResponse:
    try:
        media = media_service.add_media(db, request_id, data)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.detail)
    return MediaResponse.model_validate(media)


@router.get(
    "/{request_id}/media",
    response_model=list[MediaResponse],
)
def get_media(
    request_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> list[MediaResponse]:
    try:
        items = media_service.get_media(db, request_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.detail)
    return [MediaResponse.model_validate(m) for m in items]
