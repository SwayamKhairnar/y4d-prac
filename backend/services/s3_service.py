"""AWS S3 helper functions for presigned upload and download URLs."""

from __future__ import annotations

import logging
import os
import re
import uuid
from functools import lru_cache

import boto3
from botocore.config import Config
from botocore.exceptions import BotoCoreError, ClientError
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

_SAFE_FILENAME_RE = re.compile(r"[^A-Za-z0-9._-]+")
_MAX_FILENAME_LENGTH = 120
_UPLOAD_URL_EXPIRES_IN = 600
_DOWNLOAD_URL_EXPIRES_IN = 600


class S3ConfigurationError(RuntimeError):
    pass


@lru_cache(maxsize=1)
def get_s3_client():
    aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    aws_region = os.getenv("AWS_REGION")

    missing = [
        name
        for name, value in {
            "AWS_ACCESS_KEY_ID": aws_access_key_id,
            "AWS_SECRET_ACCESS_KEY": aws_secret_access_key,
            "AWS_REGION": aws_region,
        }.items()
        if not value
    ]
    if missing:
        raise S3ConfigurationError(
            f"Missing required AWS environment variables: {', '.join(missing)}"
        )

    return boto3.client(
        "s3",
        region_name=aws_region,
        endpoint_url=f"https://s3.{aws_region}.amazonaws.com",
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        config=Config(
            signature_version="s3v4",
            s3={"addressing_style": "virtual"},
        ),
    )


def get_bucket_name() -> str:
    bucket = os.getenv("AWS_S3_BUCKET")
    if not bucket:
        raise S3ConfigurationError("AWS_S3_BUCKET is not set")
    return bucket


def sanitize_file_name(file_name: str) -> str:
    base_name = file_name.replace("\\", "/").split("/")[-1].strip()
    base_name = _SAFE_FILENAME_RE.sub("_", base_name)
    base_name = base_name.strip("._")
    if not base_name:
        base_name = "file"
    return base_name[:_MAX_FILENAME_LENGTH]


def build_object_key(request_id: uuid.UUID, file_name: str) -> str:
    safe_file_name = sanitize_file_name(file_name)
    return f"requests/{request_id}/{uuid.uuid4()}_{safe_file_name}"


def create_presigned_put_url(
    *,
    request_id: uuid.UUID,
    file_name: str,
    file_type: str,
) -> tuple[str, str, int]:
    bucket = get_bucket_name()
    key = build_object_key(request_id, file_name)
    client = get_s3_client()

    try:
        upload_url = client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": bucket,
                "Key": key,
                "ContentType": file_type,
            },
            ExpiresIn=_UPLOAD_URL_EXPIRES_IN,
        )
    except (ClientError, BotoCoreError) as exc:
        logger.exception("Failed to generate presigned S3 upload URL")
        raise RuntimeError("Failed to generate presigned upload URL") from exc

    return upload_url, key, _UPLOAD_URL_EXPIRES_IN


def generate_presigned_upload_url(
    *,
    request_id: uuid.UUID,
    file_name: str,
    file_type: str,
) -> tuple[str, str, int]:
    return create_presigned_put_url(
        request_id=request_id,
        file_name=file_name,
        file_type=file_type,
    )


def validate_request_object_key(request_id: uuid.UUID, object_key: str) -> None:
    expected_prefix = f"requests/{request_id}/"
    if not object_key.startswith(expected_prefix):
        raise ValueError(
            f"object_key must start with '{expected_prefix}' for request '{request_id}'"
        )


def generate_presigned_download_url(
    *,
    object_key: str,
) -> tuple[str, int]:
    bucket = get_bucket_name()
    client = get_s3_client()

    try:
        download_url = client.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": bucket,
                "Key": object_key,
            },
            ExpiresIn=_DOWNLOAD_URL_EXPIRES_IN,
        )
    except (ClientError, BotoCoreError) as exc:
        logger.exception("Failed to generate presigned S3 download URL")
        raise RuntimeError("Failed to generate presigned download URL") from exc

    return download_url, _DOWNLOAD_URL_EXPIRES_IN
