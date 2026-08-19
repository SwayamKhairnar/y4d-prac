import os

import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv


def main() -> None:
    load_dotenv()

    aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    aws_region = os.getenv("AWS_REGION")
    aws_s3_bucket = os.getenv("AWS_S3_BUCKET")

    missing = [
        name
        for name, value in {
            "AWS_ACCESS_KEY_ID": aws_access_key_id,
            "AWS_SECRET_ACCESS_KEY": aws_secret_access_key,
            "AWS_REGION": aws_region,
            "AWS_S3_BUCKET": aws_s3_bucket,
        }.items()
        if not value
    ]
    if missing:
        print(f"Missing required environment variables: {', '.join(missing)}")
        return

    s3_client = boto3.client(
        "s3",
        region_name=aws_region,
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
    )

    try:
        s3_client.head_bucket(Bucket=aws_s3_bucket)
        print(f"S3 bucket '{aws_s3_bucket}' is accessible.")
    except ClientError as error:
        response = error.response.get("Error", {})
        code = response.get("Code", "Unknown")
        message = response.get("Message", "Unknown error")
        print(f"S3 access failed: {code} - {message}")


if __name__ == "__main__":
    main()
