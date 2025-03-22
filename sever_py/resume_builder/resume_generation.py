from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage

import json

from agent import build_resume_builder_agent
from utils import extract_json_from_text

def generate_resume(state: ResumeBuilderState) -> Dict:
    """Generate the resume in JSON format according to the template."""
    llm = get_llm()
    
    template_str = json.dumps(state["resume_template"], indent=2)
    
    messages = state["messages"] + [
        HumanMessage(content=f"""
        STEP 3: Now, create my resume in JSON format that follows the exact structure of the provided template.
        
        TEMPLATE STRUCTURE:
        {template_str}
        
        Based on your analysis of the job requirements and my profile, create a tailored resume in JSON format.
        
        IMPORTANT: 
        1. The output must be valid JSON that matches the EXACT structure of the template.
        2. Include only the JSON object in your response, formatted with triple backticks.
        3. All fields in the template must be present in your output.
        4. Focus on highlighting experiences and skills most relevant to the job description.
        5. Your output should look like this:
        
        ```
        {{
          "field1": "value1",
          "field2": "value2",
          ...
        }}
        ```
        """)
    ]
    
    response = llm.invoke(messages)
    
    # Extract JSON from the response
    try:
        resume_json = extract_json_from_text(response.content)
        
        if not resume_json:
            return {
                "messages": state["messages"] + [messages[-1], response],
                "error": "Failed to extract valid JSON from the response."
            }
        
        return {
            "messages": state["messages"] + [messages[-1], response],
            "resume_json": resume_json
        }
    except Exception as e:
        return {
            "messages": state["messages"] + [messages[-1], response],
            "error": f"Error processing resume: {str(e)}"
        }

def build_resume(job_description: str, user_profile: Dict[str, Any], resume_template: Dict[str, Any]) -> Dict[str, Any]:
    """
    Build a resume using the AI agent.
    
    Args:
        job_description (str): The job description text
        user_profile (dict): User's profile information
        resume_template (dict): Template structure for the resume
        
    Returns:
        dict: The generated resume in JSON format
    """
    # Initialize the agent
    resume_agent = build_resume_builder_agent()
    
    # Initialize the state
    initial_state = {
        "messages": [],
        "job_description": job_description,
        "user_profile": user_profile,
        "resume_template": resume_template,
        "resume_json": {},
        "error": ""
    }
    
    # Run the agent
    final_state = resume_agent.invoke(initial_state)
    
    # Return the generated resume
    return final_state["resume_json"]