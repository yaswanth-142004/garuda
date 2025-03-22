import json
import re
from typing import Dict, Any 


def extract_json_from_text(text: str) -> Dict[str, Any]:
    """Extract JSON object from text."""
    # Find content between triple backticks if present
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
    
    try:
        # Try to parse the JSON
        return json.loads(json_str)
    except json.JSONDecodeError:
        # If parsing fails, return empty dict
        return {}
