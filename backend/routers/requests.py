"""
routers/requests.py — HTTP endpoints for help requests.

Responsibilities: input validation (via Pydantic), DB session injection,
calling service functions, and translating domain errors to HTTP responses.
No SQL queries here.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from core.exceptions import NotFoundError
from database import get_db
from schemas import (
    RequestCreate,
    RequestListResponse,
    RequestResponse,
    RequestUpdate,
)
from services import request_service

router = APIRouter()


@router.get("", response_model=RequestListResponse)
def list_requests(
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    limit: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    category: str | None = Query(None, description="Filter by category"),
    status: str | None = Query(None, description="Filter by status"),
    search: str | None = Query(None, description="Search title and description"),
    db: Session = Depends(get_db),
) -> RequestListResponse:
    return request_service.list_requests(
        db, page=page, limit=limit, category=category, status=status, search=search
    )


@router.get("/{request_id}", response_model=RequestResponse)
def get_request(
    request_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> RequestResponse:
    try:
        req = request_service.get_request(db, request_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.detail)
    return RequestResponse.model_validate(req)


@router.post("", response_model=RequestResponse, status_code=status.HTTP_201_CREATED)
def create_request(
    data: RequestCreate,
    db: Session = Depends(get_db),
) -> RequestResponse:
    try:
        req = request_service.create_request(db, data)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.detail)
    return RequestResponse.model_validate(req)


@router.patch("/{request_id}", response_model=RequestResponse)
def update_request(
    request_id: uuid.UUID,
    data: RequestUpdate,
    db: Session = Depends(get_db),
) -> RequestResponse:
    try:
        req = request_service.update_request(db, request_id, data)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.detail)
    return RequestResponse.model_validate(req)


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_request(
    request_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> None:
    try:
        request_service.delete_request(db, request_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.detail)
