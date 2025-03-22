def review_profile(state: ResumeBuilderState) -> Dict:
    """Review the user profile and match it with job requirements."""
    llm = get_llm()
    
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