import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langserve import add_routes
from dotenv import load_dotenv

from app.api.routes import resume, memory
from app.graphs.builder import build_resume_builder_graph

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Resume Builder API",
    description="API for building tailored resumes using AI",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add API routes
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
app.include_router(memory.router, prefix="/api/memory", tags=["memory"])

# Add LangServe routes for direct graph access
add_routes(
    app,
    build_resume_builder_graph(),
    path="/api/langserve/resume-builder",
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Resume Builder API",
        "docs_url": "/docs",
        "api_version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
