"""
models.py — SQLAlchemy ORM models for Y4D Community Help & Resource Hub.

These models map to tables that already exist in Supabase PostgreSQL.
Nothing here creates or alters tables. Base.metadata.create_all() is
intentionally NOT called anywhere.
"""

import uuid

from sqlalchemy import (
    CheckConstraint,
    Column,
    ForeignKey,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import TIMESTAMP, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


# ---------------------------------------------------------------------------
# 1. USERS
# ---------------------------------------------------------------------------

class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,   # Python-side default; DB also has gen_random_uuid()
    )
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    # Relationships (back-references for convenience)
    requests = relationship("Request", back_populates="creator", cascade="all, delete")
    volunteer_entries = relationship("Volunteer", back_populates="user", cascade="all, delete")

    def __repr__(self):
        return f"<User id={self.id} email={self.email!r}>"


# ---------------------------------------------------------------------------
# 2. HELP REQUESTS
# ---------------------------------------------------------------------------

class Request(Base):
    __tablename__ = "requests"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    location = Column(String(200), nullable=True)   # optional field
    status = Column(String(20), nullable=False, server_default="open")
    created_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    # Mirrors the CHECK constraint from schema.sql
    __table_args__ = (
        CheckConstraint(
            "status IN ('open', 'in_progress', 'resolved')",
            name="requests_status_check",
        ),
    )

    # Relationships
    creator = relationship("User", back_populates="requests")
    media = relationship("RequestMedia", back_populates="request", cascade="all, delete")
    volunteers = relationship("Volunteer", back_populates="request", cascade="all, delete")

    def __repr__(self):
        return f"<Request id={self.id} title={self.title!r} status={self.status!r}>"


# ---------------------------------------------------------------------------
# 3. REQUEST MEDIA
# ---------------------------------------------------------------------------

class RequestMedia(Base):
    __tablename__ = "request_media"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    request_id = Column(
        UUID(as_uuid=True),
        ForeignKey("requests.id", ondelete="CASCADE"),
        nullable=False,
    )
    file_url = Column(Text, nullable=False)
    file_name = Column(String(255), nullable=True)
    file_type = Column(String(100), nullable=True)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    # Relationship
    request = relationship("Request", back_populates="media")

    def __repr__(self):
        return f"<RequestMedia id={self.id} file_name={self.file_name!r}>"


# ---------------------------------------------------------------------------
# 4. VOLUNTEERS
# ---------------------------------------------------------------------------

class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    request_id = Column(
        UUID(as_uuid=True),
        ForeignKey("requests.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    # Mirrors the UNIQUE constraint from schema.sql
    __table_args__ = (
        UniqueConstraint("request_id", "user_id", name="unique_request_volunteer"),
    )

    # Relationships
    request = relationship("Request", back_populates="volunteers")
    user = relationship("User", back_populates="volunteer_entries")

    def __repr__(self):
        return f"<Volunteer id={self.id} request_id={self.request_id} user_id={self.user_id}>"
