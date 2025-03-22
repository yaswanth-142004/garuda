from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List, Any, Optional

from app.core.models import (
    ResumeRequest, 
    ResumeResponse, 
    ResumeUpdateRequest, 
    ChatRequest, 
    ChatResponse
)
from app.services.resume import ResumeService
from app.services.memory import MemoryService

router = APIRouter()
resume_service = ResumeService()
memory_service = MemoryService()

# Define this function at the top since it's used in other functions
def get_default_template():
    """Return the default resume template."""
    return {
        "basics": {
            "name": "",
            "email": "",
            "phone": "",
            "summary": ""
        },
        "experience": [
            {
                "position": "",
                "company": "",
                "location": "",
                "startDate": "",
                "endDate": "",
                "highlights": []
            }
        ],
        "education": [
            {
                "institution": "",
                "area": "",
                "studyType": "",
                "startDate": "",
                "endDate": ""
            }
        ],
        "skills": [
            {
                "name": "",
                "level": "",
                "keywords": []
            }
        ],
        "certifications": [
            {
                "name": "",
                "date": "",
                "issuer": ""
            }
        ]
    }

@router.post("/build", response_model=ResumeResponse)
async def build_resume(request: ResumeRequest):
    """Build a tailored resume based on job description and user profile."""
    try:
        # Handle Pydantic model conversion safely
        user_profile = request.user_profile.model_dump() if hasattr(request.user_profile, "model_dump") else request.user_profile.dict()
        resume_template = None
        if request.resume_template:
            resume_template = request.resume_template.model_dump() if hasattr(request.resume_template, "model_dump") else request.resume_template.dict()
        else:
            resume_template = get_default_template()
            
        resume_json, memory_id, user_id = resume_service.build_resume(
            request.job_description,
            user_profile,
            resume_template,
            request.user_id
        )
        
        return {
            "resume": resume_json,
            "memory_id": memory_id,
            "user_id": user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error building resume: {str(e)}")

@router.post("/update", response_model=ResumeResponse)
async def update_resume(request: ResumeUpdateRequest):
    """Update an existing resume based on user instructions."""
    try:
        # Get the existing resume
        resume_data = memory_service.get_resume_by_id(request.user_id, request.resume_id)
        if not resume_data:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Update the resume
        updated_resume, memory_id = resume_service.update_resume(
            request.user_id,
            resume_data["resume"],
            get_default_template(),  # Using default template for validation
            request.instruction
        )
        
        return {
            "resume": updated_resume,
            "memory_id": memory_id,
            "user_id": request.user_id
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating resume: {str(e)}")

@router.get("/history/{user_id}", response_model=List[Dict[str, Any]])
async def get_resume_history(user_id: str):
    """Get all previous resumes for a user."""
    try:
        resumes = memory_service.get_previous_resumes(user_id)
        return resumes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving resume history: {str(e)}")

@router.get("/{user_id}/{memory_id}")
async def get_resume(user_id: str, memory_id: str):
    """Get a specific resume by ID."""
    try:
        resume_data = memory_service.get_resume_by_id(user_id, memory_id)
        if not resume_data:
            raise HTTPException(status_code=404, detail="Resume not found")
        return resume_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving resume: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat_with_resume(request: ChatRequest):
    """Chat with the AI to update a resume."""
    try:
        # Get the existing resume if resume_id is provided
        resume_json = {}
        if request.resume_id:
            resume_data = memory_service.get_resume_by_id(request.user_id, request.resume_id)
            if not resume_data:
                raise HTTPException(status_code=404, detail="Resume not found")
            resume_json = resume_data["resume"]
        
        # If no resume exists, return an error
        if not resume_json:
            return ChatResponse(
                message="Please create a resume first before chatting about updates."
            )
        
        # Update the resume
        updated_resume, memory_id = resume_service.update_resume(
            request.user_id,
            resume_json,
            get_default_template(),  # Using default template for validation
            request.message
        )
        
        return ChatResponse(
            message="I've updated your resume based on your request.",
            updated_resume=updated_resume,
            memory_id=memory_id
        )
    except ValueError as e:
        return ChatResponse(
            message=f"I couldn't update the resume: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in chat: {str(e)}")
