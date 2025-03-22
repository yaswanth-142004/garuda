from typing import TypedDict, Annotated, List, Dict, Any
import operator
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END

from app.graphs.nodes import (
    analyze_job, 
    review_profile, 
    generate_resume, 
    handle_error, 
    conversational_resume_editor,
    check_error_condition
)


class ResumeBuilderState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    job_description: str
    user_profile: Dict[str, Any]
    resume_template: Dict[str, Any]
    resume_json: Dict[str, Any]
    error: str
    user_instruction: str


def build_resume_builder_graph():
    """Build and return the resume builder agent with conversational editing."""
    # Create the graph builder
    graph_builder = StateGraph(ResumeBuilderState)
    
    # Add nodes
    graph_builder.add_node("analyze_job", analyze_job)
    graph_builder.add_node("review_profile", review_profile)
    graph_builder.add_node("generate_resume", generate_resume)
    graph_builder.add_node("handle_error", handle_error)
    graph_builder.add_node("conversational_update", conversational_resume_editor)
    
    # Add edges
    graph_builder.add_edge("analyze_job", "review_profile")
    graph_builder.add_edge("review_profile", "generate_resume")
    
    # Add conditional edges for error handling
    graph_builder.add_conditional_edges(
        "generate_resume",
        check_error_condition,
        {
            "handle_error": "handle_error",
            "end": END
        }
    )
    
    graph_builder.add_conditional_edges(
        "handle_error",
        check_error_condition,
        {
            "handle_error": "handle_error",
            "end": END
        }
    )
    
    # Add conditional edge for conversational updates
    graph_builder.add_conditional_edges(
        "conversational_update",
        check_error_condition,
        {
            "handle_error": "handle_error",
            "end": END
        }
    )
    
    # Set the entry point
    graph_builder.set_entry_point("analyze_job")
    
    # Compile the graph
    return graph_builder.compile()
