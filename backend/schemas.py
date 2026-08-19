"""
schemas.py — Pydantic v2 request/response models for Y4D backend.

Strict separation from SQLAlchemy ORM models. All schemas use
ConfigDict(from_attributes=True) so they can be constructed from ORM
instances via model_validate().
"""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


# ---------------------------------------------------------------------------
# 1. USER SCHEMAS
# ---------------------------------------------------------------------------


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: str
    created_at: datetime


# ---------------------------------------------------------------------------
# 2. REQUEST SCHEMAS
# ---------------------------------------------------------------------------

VALID_STATUSES = {"open", "in_progress", "resolved"}


class RequestCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1, max_length=50)
    location: Optional[str] = Field(None, max_length=200)
    created_by: uuid.UUID


class RequestUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    location: Optional[str] = Field(None, max_length=200)
    status: Optional[str] = None

    def model_post_init(self, __context: object) -> None:
        if self.status is not None and self.status not in VALID_STATUSES:
            raise ValueError(
                f"Invalid status '{self.status}'. Must be one of: {sorted(VALID_STATUSES)}"
            )


class RequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    description: str
    category: str
    location: Optional[str]
    status: str
    created_by: uuid.UUID
    created_at: datetime
    updated_at: datetime


class RequestListResponse(BaseModel):
    items: list[RequestResponse]
    total: int
    page: int
    limit: int
    pages: int


# ---------------------------------------------------------------------------
# 3. VOLUNTEER SCHEMAS
# ---------------------------------------------------------------------------


class VolunteerCreate(BaseModel):
    user_id: uuid.UUID


class VolunteerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    request_id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime


# ---------------------------------------------------------------------------
# 4. MEDIA SCHEMAS
# ---------------------------------------------------------------------------


class MediaCreate(BaseModel):
    file_url: str = Field(..., min_length=1)
    file_name: Optional[str] = Field(None, max_length=255)
    file_type: Optional[str] = Field(None, max_length=100)


class MediaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    request_id: uuid.UUID
    file_url: str
    file_name: Optional[str]
    file_type: Optional[str]
    created_at: datetime
