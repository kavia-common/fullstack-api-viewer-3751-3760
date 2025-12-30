from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class HelloResponse(BaseModel):
    """Response payload for the Hello World endpoint."""

    message: str = Field(..., description="A friendly greeting from the API.")


openapi_tags = [
    {
        "name": "Health",
        "description": "Health and status endpoints.",
    },
    {
        "name": "Hello",
        "description": "Demo endpoints used by the Electron/React frontend.",
    },
]

app = FastAPI(
    title="Fullstack API Viewer Backend",
    description=(
        "FastAPI backend for the Fullstack API Viewer project.\n\n"
        "The Electron/React frontend calls `GET /hello` to display a simple JSON response."
    ),
    version="0.1.0",
    openapi_tags=openapi_tags,
)

# CORS notes:
# - In dev, Electron renderer may load from http://localhost:<vite-port> (typically 5173)
# - In some environments it may appear as file:// (no Origin header) or custom schemes.
# - For broad compatibility, we allow common localhost origins explicitly AND keep '*' as a fallback.
#
# If you want to lock this down further, remove '*' and enumerate exact origins in allow_origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:5173",
        "http://localhost:4173",
        "http://127.0.0.1",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:4173",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/",
    tags=["Health"],
    summary="Health check",
    operation_id="health_check",
)
def health_check() -> dict[Literal["message"], str]:
    """Health check endpoint used to verify the server is running."""
    return {"message": "Healthy"}


# PUBLIC_INTERFACE
@app.get(
    "/hello",
    response_model=HelloResponse,
    tags=["Hello"],
    summary="Hello World",
    operation_id="get_hello",
)
def hello() -> HelloResponse:
    """Return a simple Hello World JSON payload for the frontend demo."""
    return HelloResponse(message="Hello World")
