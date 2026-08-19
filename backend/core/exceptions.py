"""
core/exceptions.py — Application-level exception types for Y4D backend.

These are raised by service functions and translated into HTTP responses
by exception handlers registered in main.py.

Keeps SQLAlchemy/database internals out of router layer entirely.
"""


class NotFoundError(Exception):
    """Raised when a requested resource does not exist in the database."""

    def __init__(self, resource: str, identifier: str | None = None):
        self.resource = resource
        self.identifier = identifier
        detail = f"{resource} not found"
        if identifier:
            detail = f"{resource} with id '{identifier}' not found"
        super().__init__(detail)
        self.detail = detail


class DuplicateError(Exception):
    """Raised when a uniqueness constraint would be violated (e.g. duplicate volunteer)."""

    def __init__(self, message: str):
        super().__init__(message)
        self.detail = message
