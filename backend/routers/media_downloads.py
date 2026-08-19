"""HTTP endpoint for generating presigned S3 download URLs."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.exceptions import NotFoundError
from database import get_db
from schemas import MediaDownloadUrlResponse
from services import media_service, s3_service

router = APIRouter()


@router.get(
    "/media/{media_id}/download-url",
    response_model=MediaDownloadUrlResponse,
)
def get_download_url(
    media_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> MediaDownloadUrlResponse:
    try:
        media = media_service.get_media_item(db, media_id)
        s3_service.validate_request_object_key(media.request_id, media.file_url)
        download_url, expires_in = s3_service.generate_presigned_download_url(
            object_key=media.file_url,
        )
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.detail)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except RuntimeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate S3 download URL",
        )

    return MediaDownloadUrlResponse(
        download_url=download_url,
        file_name=media.file_name or "",
        file_type=media.file_type or "",
        expires_in=expires_in,
    )
