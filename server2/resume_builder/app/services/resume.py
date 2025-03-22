from typing import Dict, List, Any, Optional, Tuple
import uuid

from app.services.llm import LLMService
from app.services.memory import MemoryService
from app.graphs.builder import build_resume_builder_graph
from app.graphs.nodes import conversational_resume_editor

class ResumeService:
    def __init__(self):
        self.llm_service = LLMService()
        self.memory_service = MemoryService()
    
    def build_resume(self, job_description: str, user_profile: Dict[str, Any], 
                     resume_template: Dict[str, Any], user_id: Optional[str] = None) -> Tuple[Dict[str, Any], str, str]:
        """
        Build a resume using the AI agent and store it in memory.
        
        Returns:
            Tuple containing (resume_json, memory_id, user_id)
        """
        # Initialize the agent
        resume_agent = build_resume_builder_graph()
        
        # Generate user_id if not provided
        if not user_id:
            user_id = str(uuid.uuid4())
        
        # Initialize the state
        initial_state = {
            "messages": [],
            "job_description": job_description,
            "user_profile": user_profile,
            "resume_template": resume_template,
            "resume_json": {},
            "error": "",
            "user_instruction": ""
        }
        
        # Run the agent
        final_state = resume_agent.invoke(initial_state)
        
        # Store the generated resume in memory
        memory_id = self.memory_service.store_resume(
            user_id, 
            job_description, 
            final_state["resume_json"]
        )
        
        # Return the generated resume
        return final_state["resume_json"], memory_id, user_id
    
    def update_resume(self, user_id: str, resume_json: Dict[str, Any], 
                  resume_template: Dict[str, Any], instruction: str) -> Tuple[Dict[str, Any], str]:
    
    # Initialize the state for conversational update
        update_state = {
            "messages": [],
            "resume_json": resume_json,
            "resume_template": resume_template,
            "user_instruction": instruction,
            "error": ""
        }
        
        try:
            # Process the update directly
            update_state = conversational_resume_editor(update_state)
            
            if "error" in update_state and update_state["error"]:
                raise ValueError(update_state["error"])
            
            # Ensure the updated resume is a dictionary
            updated_resume = update_state.get("resume_json", {})
            if not isinstance(updated_resume, dict):
                raise ValueError("Updated resume is not in the correct format")
            
            # Store the updated resume in memory
            memory_id = self.memory_service.store_resume(
                user_id, 
                f"Updated via instruction: {instruction}", 
                updated_resume
            )
            
            return updated_resume, memory_id
        
        except Exception as e:
            raise ValueError(f"Error updating resume: {str(e)}")