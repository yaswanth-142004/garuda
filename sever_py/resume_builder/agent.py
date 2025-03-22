from langgraph.graph import StateGraph, END
from job_analysis import analyze_job
from profile_review import review_profile
from resume_generation import generate_resume
from error_handling import handle_error


def check_error_condition(state: ResumeBuilderState) -> str:
    """Check if there's an error that needs handling."""
    if state.get("error", ""):
        return "handle_error"
    return "end"

def build_resume_builder_agent():
    """Build and return the resume builder agent."""
    # Create the graph builder
    graph_builder = StateGraph(ResumeBuilderState)
    
    # Add nodes
    graph_builder.add_node("analyze_job", analyze_job)
    graph_builder.add_node("review_profile", review_profile)
    graph_builder.add_node("generate_resume", generate_resume)
    graph_builder.add_node("handle_error", handle_error)
    
    # Add edges
    graph_builder.add_edge("analyze_job", "review_profile")
    graph_builder.add_edge("review_profile", "generate_resume")
    
    # Add conditional edges
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
    
    # Set the entry point
    graph_builder.set_entry_point("analyze_job")
    
    # Compile the graph
    return graph_builder.compile()