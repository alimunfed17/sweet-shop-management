from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import create_tables
from app.core.config import get_settings
from app.api.main import api_router

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    create_tables()

@app.get("/")
def root():
    return {
        "message": "Welcome to Sweets Management API",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(api_router)