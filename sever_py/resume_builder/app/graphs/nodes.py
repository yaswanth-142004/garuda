import json
import re
from typing import Dict, Any
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

from app.services.llm import LLMService

llm_service = LLMService()

SYSTEM_PROMPT = """You are an expert resume builder agent designed to create tailored, professional resumes. Your task is to analyze job descriptions, match them with user profiles, and generate optimized resumes that follow specific templates.

GUIDELINES:
1. Carefully analyze the job description to identify key requirements, skills, and qualifications.
2. Review the user's profile to understand their experience, skills, education, and achievements.
3. Tailor the resume to highlight experiences and skills most relevant to the job description.
4. Use strong action verbs and quantify achievements whenever possible.
5. Follow the exact structure of the provided template.
6. Format the final output as valid JSON that matches the template structure.
7. Be concise, professional, and honest - do not invent information not present in the user's profile.

PROCESS:
1. Analyze the job requirements to identify key skills and qualifications
2. Match the user's profile with the job requirements
3. Create a tailored resume that highlights relevant experiences
4. Format the resume according to the provided template
5. Return the result as a valid JSON object

Remember, the goal is to create a resume that will help the user stand out while accurately representing their qualifications for the specific job they're applying to.
"""


def extract_json_from_text(text: str) -> Dict[str, Any]:
    """Extract JSON object from text with improved error handling."""
    # Find content between triple backticks
    json_match = re.search(r"``````", text)
    if json_match:
        json_str = json_match.group(1)
    else:
        # If no backticks, try to find JSON object directly
        json_match = re.search(r"(\{[\s\S]*\})", text)
        if json_match:
            json_str = json_match.group(1)
        else:
            # If still no match, use the whole text
            json_str = text
    
    # Clean up common JSON formatting errors
    json_str = re.sub(r',(\s*[\]}])', r'\1', json_str)  # Remove trailing commas
    
    try:
        # Try to parse the JSON
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        try:
            # Try using a more lenient JSON parser as fallback
            import json5
            return json5.loads(json_str)
        except:
            # If all parsing fails, return empty dict
            return {}


def validate_json_structure(json_data: Dict[str, Any], template: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate and fix JSON structure against the template.
    Handles duplicate keys by keeping only the most complete version.
    """
    result = {}
    
    # Process each key in the template
    for key, value in template.items():
        if key not in json_data:
            # If key is missing in the generated JSON, use template value
            result[key] = value
        elif isinstance(value, list) and isinstance(json_data[key], list):
            # Handle list values (like certifications)
            result[key] = []
            for item in json_data[key]:
                if isinstance(item, dict):
                    # Validate each item against the template item
                    template_item = value[0] if len(value) > 0 else {}
                    valid_item = {k: item.get(k, v) for k, v in template_item.items()}
                    if any(v for v in valid_item.values()):  # Only add non-empty items
                        result[key].append(valid_item)
        elif isinstance(value, dict) and isinstance(json_data[key], dict):
            # Handle nested dictionaries
            result[key] = {k: json_data[key].get(k, v) for k, v in value.items()}
        else:
            # For simple values, use the generated value
            result[key] = json_data[key]
            
    return result


def analyze_job(state):
    """Analyze the job description and identify key requirements."""
    llm = llm_service.get_llm()
    
    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=f"""
        STEP 1: Analyze the job description below and identify the key requirements, skills, and qualifications:
        
        JOB DESCRIPTION:
        {state["job_description"]}
        
        Please provide a detailed analysis of what the employer is looking for in an ideal candidate.
        """)
    ]
    
    response = llm.invoke(messages)
    
    return {
        "messages": state["messages"] + [messages[1], response]
    }


def review_profile(state):
    """Review the user profile and match it with job requirements."""
    llm = llm_service.get_llm()
    
    # Get the previous analysis from the messages
    previous_messages = state["messages"]
    
    profile_str = json.dumps(state["user_profile"], indent=2)
    
    messages = previous_messages + [
        HumanMessage(content=f"""
        STEP 2: Based on your analysis of the job requirements, review my profile below and identify the most relevant experiences, skills, and achievements that match the job requirements:
        
        MY PROFILE:
        {profile_str}
        
        Please list the key elements from my profile that should be highlighted in the resume.
        """)
    ]
    
    response = llm.invoke(messages)
    
    return {
        "messages": state["messages"] + [messages[-1], response]
    }


def generate_resume(state):
    """Generate the resume in JSON format according to the template."""
    llm = llm_service.get_llm("llama-3.1-8b-instant")
    
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
        4. Each section like "certifications" should appear EXACTLY ONCE in the output.
        5. Focus on highlighting experiences and skills most relevant to the job description.
        6. Make sure all brackets and braces are properly closed and balanced.
        7. Your output should look like this:
        
        ```
        {{{{
          "field1": "value1",
          "field2": "value2",
          ...
        }}}}
        ```
        """)
    ]
    
    response = llm.invoke(messages)
    
    # Extract and validate JSON
    try:
        raw_json = extract_json_from_text(response.content)
        
        if not raw_json:
            return {
                "messages": state["messages"] + [messages[-1], response],
                "error": "Failed to extract valid JSON from the response."
            }
        
        # Validate and fix JSON structure against the template
        resume_json = validate_json_structure(raw_json, state["resume_template"])
        
        return {
            "messages": state["messages"] + [messages[-1], response],
            "resume_json": resume_json
        }
    except Exception as e:
        return {
            "messages": state["messages"] + [messages[-1], response],
            "error": f"Error processing resume: {str(e)}"
        }


def handle_error(state):
    """Handle errors in the resume generation process."""
    llm = llm_service.get_llm()
    
    template_str = json.dumps(state["resume_template"], indent=2)
    
    messages = state["messages"] + [
        HumanMessage(content=f"""
        ERROR: {state["error"]}
        
        Please try again to create a valid JSON resume that exactly matches the template structure below:
        
        {template_str}
        
        Your response should ONLY contain the JSON object wrapped in triple backticks, like this:
        
        ```
        {
          "field1": "value1",
          "field2": "value2",
          ...
        }
        ```
        """)
    ]
    
    response = llm.invoke(messages)
    
    try:
        resume_json = extract_json_from_text(response.content)
        
        if not resume_json:
            return {
                "messages": state["messages"] + [messages[-1], response],
                "error": "Still unable to extract valid JSON. Please check the template format."
            }
        
        return {
            "messages": state["messages"] + [messages[-1], response],
            "resume_json": resume_json,
            "error": ""  # Clear the error
        }
    except Exception as e:
        return {
            "messages": state["messages"] + [messages[-1], response],
            "error": f"Error processing resume: {str(e)}"
        }


def conversational_resume_editor(state):
    """Process user instructions to update the resume in a conversational manner."""
    llm = llm_service.get_llm()
    
    # Get the current resume and user instruction
    current_resume = state.get("resume_json", {})
    user_instruction = state.get("user_instruction", "")
    
    if not current_resume:
        return {
            "messages": state["messages"] + [
                AIMessage(content="I need to generate a resume first before I can update it. Let me do that for you.")
            ],
            "error": "No resume to update. Please generate a resume first."
        }
    
    messages = state["messages"] + [
        SystemMessage(content=f"""You are an expert resume editor. 
        You have a current resume in JSON format and need to update it based on the user's instructions.
        Current resume: {json.dumps(current_resume, indent=2)}
        
        Make precise updates to the resume based on the user's instructions while maintaining the same JSON structure.
        Return only the updated JSON with no additional text or explanations."""),
        HumanMessage(content=f"Please update this resume according to the following instruction: {user_instruction}")
    ]
    
    response = llm.invoke(messages)
    
    # Extract and validate JSON
    try:
        updated_json = extract_json_from_text(response.content)
        
        if not updated_json:
            return {
                "messages": state["messages"] + [messages[-1], response],
                "error": "Failed to extract valid JSON from the response."
            }
        
        # Validate and fix JSON structure against the template
        updated_resume = validate_json_structure(updated_json, state["resume_template"])
        
        return {
            "messages": state["messages"] + [messages[-1], response],
            "resume_json": updated_resume,
            "user_instruction": ""  # Clear the instruction after processing
        }
    except Exception as e:
        return {
            "messages": state["messages"] + [messages[-1], response],
            "error": f"Error updating resume: {str(e)}"
        }


def check_error_condition(state):
    """Check if there's an error that needs handling."""
    if state.get("error", ""):
        return "handle_error"
    return "end"
