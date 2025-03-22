import uuid
import datetime
from typing import Dict, List, Any, Optional
from langgraph.store.memory import InMemoryStore

# Create memory store
memory_store = InMemoryStore()


class MemoryService:
    @staticmethod
    def store_resume(user_id: str, job_description: str, resume: Dict[str, Any]) -> str:
        """Store a resume in memory and return the memory ID."""
        namespace = (user_id, "resumes")
        memory_id = str(uuid.uuid4())
        
        memory_data = {
            "job_description": job_description,
            "resume": resume,
            "timestamp": datetime.datetime.now().isoformat()
        }
        
        memory_store.put(namespace, memory_id, memory_data)
        
        return memory_id
    
    @staticmethod
    def get_previous_resumes(user_id: str) -> List[Dict]:
        """Retrieve all previous resumes for a user from memory."""
        namespace = (user_id, "resumes")
        memories = memory_store.search(namespace)
        
        resumes = []
        for memory in memories:
            resumes.append({
                "memory_id": memory.key,
                "data": memory.value,
                "created_at": memory.created_at
            })
        
        return resumes
    
    @staticmethod
    def get_resume_by_id(user_id: str, memory_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a specific resume by memory ID."""
        namespace = (user_id, "resumes")
        try:
            memory = memory_store.get(namespace, memory_id)
            return memory
        except:
            return None
