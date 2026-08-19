"""
services/volunteer_service.py — Business logic for volunteering on requests.

Handles duplicate detection by catching SQLAlchemy IntegrityError from the
UNIQUE(request_id, user_id) DB constraint, and translating it to DuplicateError.
"""

from __future__ import annotations

import uuid

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from core.exceptions import DuplicateError, NotFoundError
from models import Request, User, Volunteer


def volunteer_for_request(
    db: Session, request_id: uuid.UUID, user_id: uuid.UUID
) -> Volunteer:
    """
    Register a user as a volunteer for a request.

    Raises:
        NotFoundError: if request or user does not exist.
        DuplicateError: if the user is already volunteered for this request.
    """
    req = db.get(Request, request_id)
    if req is None:
        raise NotFoundError("Request", str(request_id))

    user = db.get(User, user_id)
    if user is None:
        raise NotFoundError("User", str(user_id))

    volunteer = Volunteer(request_id=request_id, user_id=user_id)

    try:
        db.add(volunteer)
        db.commit()
        db.refresh(volunteer)
    except IntegrityError:
        db.rollback()
        raise DuplicateError(
            f"User '{user_id}' has already volunteered for request '{request_id}'."
        )
    except Exception:
        db.rollback()
        raise

    return volunteer


def get_request_volunteers(db: Session, request_id: uuid.UUID) -> list[Volunteer]:
    """
    Return all volunteer records for the given request.

    Raises:
        NotFoundError: if the request does not exist.
    """
    req = db.get(Request, request_id)
    if req is None:
        raise NotFoundError("Request", str(request_id))

    return (
        db.query(Volunteer)
        .filter(Volunteer.request_id == request_id)
        .order_by(Volunteer.created_at.asc())
        .all()
    )
