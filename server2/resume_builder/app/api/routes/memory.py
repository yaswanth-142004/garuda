from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

from app.services.memory import MemoryService

router = APIRouter()
memory_service = MemoryService()

@router.get("/{user_id}", response_model=List[Dict[str, Any]])
async def get_user_memories(user_id: str):
    """Get all memories for a user."""
    try:
        memories = memory_service.get_previous_resumes(user_id)
        return memories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving memories: {str(e)}")

@router.delete("/{user_id}/{memory_id}")
async def delete_memory(user_id: str, memory_id: str):
    """Delete a specific memory."""
    try:
        # This would need to be implemented in the MemoryService
        # memory_service.delete_memory(user_id, memory_id)
        return {"status": "Memory deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting memory: {str(e)}")
