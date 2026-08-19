"""
routers/media.py — HTTP endpoints for request media attachments.

Accepts media metadata now. Actual S3 upload logic will be added in a
future milestone without requiring changes to this router's interface.
"""

from __future__ import annotations

import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.exceptions import NotFoundError
from database import get_db
from services import request_service, s3_service
from services import media_service
from schemas import (
    MediaCreateRequest,
    MediaResponse,
    MediaUploadUrlRequest,
    MediaUploadUrlResponse,
)

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post(
    "/{request_id}/media",
    response_model=MediaResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_media(
    request_id: uuid.UUID,
    data: MediaCreateRequest,
    db: Session = Depends(get_db),
) -> MediaResponse:
    try:
        s3_service.validate_request_object_key(request_id, data.object_key)
        media = media_service.add_media_from_object_key(db, request_id, data)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.detail)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
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


@router.post(
    "/{request_id}/media/upload-url",
    response_model=MediaUploadUrlResponse,
    status_code=status.HTTP_200_OK,
)
def create_upload_url(
    request_id: uuid.UUID,
    data: MediaUploadUrlRequest,
    db: Session = Depends(get_db),
) -> MediaUploadUrlResponse:
    try:
        request_service.get_request(db, request_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.detail)

    try:
        upload_url, object_key, expires_in = s3_service.generate_presigned_upload_url(
            request_id=request_id,
            file_name=data.file_name,
            file_type=data.file_type,
        )
    except s3_service.S3ConfigurationError as exc:
        logger.exception("S3 configuration error while generating upload URL")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate S3 upload URL",
        ) from exc
    except RuntimeError as exc:
        logger.exception("S3 upload URL generation failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate S3 upload URL",
        ) from exc

    return MediaUploadUrlResponse(
        upload_url=upload_url,
        object_key=object_key,
        file_name=data.file_name,
        file_type=data.file_type,
        expires_in=expires_in,
    )
