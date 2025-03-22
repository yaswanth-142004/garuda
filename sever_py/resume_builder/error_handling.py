




def handle_error(state: ResumeBuilderState) -> Dict:
    """Handle errors in the resume generation process."""
    llm = get_llm()
    
    template_str = json.dumps(state["resume_template"], indent=2)
    
    messages = state["messages"] + [
        HumanMessage(content=f"""
        ERROR: {state["error"]}
        
        Please try again to create a valid JSON resume that exactly matches the template structure below:
        
        {template_str}
        
        Your response should ONLY contain the JSON object wrapped in triple backticks, like this:
        
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