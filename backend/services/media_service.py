"""
services/media_service.py — Business logic for request media.

Stores media metadata (URL, name, type). Actual file storage will be
handled by AWS S3 in a future milestone. This service is intentionally
designed to make that addition easy — callers simply pass a resolved
file_url that will eventually come from a presigned S3 upload.
"""

from __future__ import annotations

import uuid

from sqlalchemy.orm import Session

from core.exceptions import NotFoundError
from models import Request, RequestMedia
from schemas import MediaCreate


def add_media(
    db: Session, request_id: uuid.UUID, data: MediaCreate
) -> RequestMedia:
    """
    Attach media metadata to an existing request.

    Raises:
        NotFoundError: if the request does not exist.
    """
    req = db.get(Request, request_id)
    if req is None:
        raise NotFoundError("Request", str(request_id))

    media = RequestMedia(
        request_id=request_id,
        file_url=data.file_url,
        file_name=data.file_name,
        file_type=data.file_type,
    )

    try:
        db.add(media)
        db.commit()
        db.refresh(media)
    except Exception:
        db.rollback()
        raise

    return media


def get_media(db: Session, request_id: uuid.UUID) -> list[RequestMedia]:
    """
    Return all media records associated with the given request.

    Raises:
        NotFoundError: if the request does not exist.
    """
    req = db.get(Request, request_id)
    if req is None:
        raise NotFoundError("Request", str(request_id))

    return (
        db.query(RequestMedia)
        .filter(RequestMedia.request_id == request_id)
        .order_by(RequestMedia.created_at.asc())
        .all()
    )
