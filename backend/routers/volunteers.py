"""
routers/volunteers.py — HTTP endpoints for volunteering on requests.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.exceptions import DuplicateError, NotFoundError
from database import get_db
from schemas import VolunteerCreate, VolunteerResponse
from services import volunteer_service

router = APIRouter()


@router.post(
    "/{request_id}/volunteer",
    response_model=VolunteerResponse,
    status_code=status.HTTP_201_CREATED,
)
def volunteer_for_request(
    request_id: uuid.UUID,
    data: VolunteerCreate,
    db: Session = Depends(get_db),
) -> VolunteerResponse:
    try:
        volunteer = volunteer_service.volunteer_for_request(db, request_id, data.user_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.detail)
    except DuplicateError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.detail)
    return VolunteerResponse.model_validate(volunteer)


@router.get(
    "/{request_id}/volunteers",
    response_model=list[VolunteerResponse],
)
def get_request_volunteers(
    request_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> list[VolunteerResponse]:
    try:
        volunteers = volunteer_service.get_request_volunteers(db, request_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.detail)
    return [VolunteerResponse.model_validate(v) for v in volunteers]
