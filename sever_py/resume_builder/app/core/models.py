from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    name: str
    email: str
    phone: str
    summary: str
    experience: List[Dict[str, Any]]
    education: List[Dict[str, Any]]
    skills: List[str]
    certifications: List[str]


class ResumeTemplate(BaseModel):
    basics: Dict[str, Any]
    experience: List[Dict[str, Any]]
    education: List[Dict[str, Any]]
    skills: List[Dict[str, Any]]
    certifications: List[Dict[str, Any]]


class ResumeRequest(BaseModel):
    job_description: str
    user_profile: UserProfile
    resume_template: Optional[ResumeTemplate] = None
    user_id: Optional[str] = None


class ResumeUpdateRequest(BaseModel):
    user_id: str
    resume_id: str
    instruction: str


class ResumeResponse(BaseModel):
    resume: Dict[str, Any]
    memory_id: str
    user_id: str


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    user_id: str
    message: str
    resume_id: Optional[str] = None


class ChatResponse(BaseModel):
    message: str
    updated_resume: Optional[Dict[str, Any]] = None
    memory_id: Optional[str] = None
