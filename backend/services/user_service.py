"""
services/user_service.py — Business logic for user-dashboard queries.

Uses efficient SQLAlchemy joins instead of Python-side filtering.
"""

from __future__ import annotations

import uuid

from sqlalchemy.orm import Session

from core.exceptions import NotFoundError
from models import Request, User, Volunteer


def _get_user_or_404(db: Session, user_id: uuid.UUID) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise NotFoundError("User", str(user_id))
    return user


def get_user_requests(db: Session, user_id: uuid.UUID) -> list[Request]:
    """
    Return all requests created by the specified user, newest first.

    Raises:
        NotFoundError: if the user does not exist.
    """
    _get_user_or_404(db, user_id)

    return (
        db.query(Request)
        .filter(Request.created_by == user_id)
        .order_by(Request.created_at.desc())
        .all()
    )


def get_user_volunteering(db: Session, user_id: uuid.UUID) -> list[Request]:
    """
    Return all requests the user has volunteered for, using a JOIN.

    Raises:
        NotFoundError: if the user does not exist.
    """
    _get_user_or_404(db, user_id)

    return (
        db.query(Request)
        .join(Volunteer, Volunteer.request_id == Request.id)
        .filter(Volunteer.user_id == user_id)
        .order_by(Request.created_at.desc())
        .all()
    )
