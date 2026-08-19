"""
services/request_service.py — Business logic for help requests.

Performs all SQLAlchemy queries and mutations. Raises application-level
exceptions (NotFoundError) rather than HTTP exceptions so the router
layer remains responsible for HTTP status codes.
"""

from __future__ import annotations

import math
import uuid
from datetime import datetime, timezone

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from core.exceptions import NotFoundError
from models import Request, User
from schemas import RequestCreate, RequestListResponse, RequestResponse, RequestUpdate

_MAX_LIMIT = 100
_DEFAULT_LIMIT = 20


def list_requests(
    db: Session,
    page: int = 1,
    limit: int = _DEFAULT_LIMIT,
    category: str | None = None,
    status: str | None = None,
    search: str | None = None,
) -> RequestListResponse:
    """Return a paginated, filtered list of requests ordered newest-first."""
    limit = min(limit, _MAX_LIMIT)
    page = max(page, 1)
    offset = (page - 1) * limit

    query = db.query(Request)

    if category:
        query = query.filter(Request.category == category)
    if status:
        query = query.filter(Request.status == status)
    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                Request.title.ilike(term),
                Request.description.ilike(term),
            )
        )

    total = query.count()
    items = (
        query.order_by(Request.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return RequestListResponse(
        items=[RequestResponse.model_validate(r) for r in items],
        total=total,
        page=page,
        limit=limit,
        pages=math.ceil(total / limit) if total > 0 else 1,
    )


def get_request(db: Session, request_id: uuid.UUID) -> Request:
    """Return a single request or raise NotFoundError."""
    req = db.get(Request, request_id)
    if req is None:
        raise NotFoundError("Request", str(request_id))
    return req


def create_request(db: Session, data: RequestCreate) -> Request:
    """
    Verify the creator user exists, then create and persist the request.
    Returns the refreshed ORM instance.
    """
    user = db.get(User, data.created_by)
    if user is None:
        raise NotFoundError("User", str(data.created_by))

    req = Request(
        title=data.title,
        description=data.description,
        category=data.category,
        location=data.location,
        created_by=data.created_by,
        status="open",
    )

    try:
        db.add(req)
        db.commit()
        db.refresh(req)
    except Exception:
        db.rollback()
        raise

    return req


def update_request(
    db: Session, request_id: uuid.UUID, data: RequestUpdate
) -> Request:
    """
    Apply a partial update to an existing request.
    Only non-None fields in data are written.
    """
    req = get_request(db, request_id)

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(req, field, value)

    # Always bump updated_at on any successful patch
    req.updated_at = datetime.now(timezone.utc)

    try:
        db.commit()
        db.refresh(req)
    except Exception:
        db.rollback()
        raise

    return req


def delete_request(db: Session, request_id: uuid.UUID) -> None:
    """
    Delete a request. DB cascades handle request_media and volunteers.
    Raises NotFoundError if the request does not exist.
    """
    req = get_request(db, request_id)
    try:
        db.delete(req)
        db.commit()
    except Exception:
        db.rollback()
        raise
