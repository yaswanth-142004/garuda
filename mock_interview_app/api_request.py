import os
from dotenv import load_dotenv
import json
import logging
from typing import Dict, List, Optional, Union
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough


# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Groq model with LangChain
groq_api_key = os.getenv('GROQ_API_KEY')
model_name = os.getenv('MODEL_TYPE', 'llama3-8b-8192')  # Default model if not specified

# Define evaluation classes for consistency
CLASSIFICATIONS = {
    'Completely correct': 10,
    'Partially correct': 5,
    'Incorrect': 0
}

class EvaluationError(Exception):
    """Custom exception for evaluation errors."""
    pass

def get_llm() -> ChatGroq:
    """Initialize and return the Groq LLM with error handling."""
    if not groq_api_key:
        raise ValueError("GROQ_API_KEY environment variable not set")
    
    try:
        return ChatGroq(
            api_key=groq_api_key,
            model_name=model_name,
            temperature=0.7,
            max_tokens=1024
        )
    except Exception as e:
        logger.error(f"Failed to initialize Groq LLM: {e}")
        raise

def calculate_percentage(result_list: List[str], marking: Dict[str, int]) -> int:
    """Calculate percentage score based on evaluation results.
    
    Args:
        result_list: List of evaluation classifications
        marking: Dictionary mapping classifications to point values
        
    Returns:
        int: Percentage score rounded to nearest 10%
    """
    if not result_list:
        logger.warning("Empty result list, returning 0")
        return 0
    
    total_points = 0
    max_points = 0

    for result in result_list:
        if result in marking:
            total_points += marking[result]
            max_points += marking['Completely correct']
        else:
            logger.warning(f"Unknown classification: {result}")

    if max_points == 0:
        logger.warning("No valid classifications found, returning 0")
        return 0
        
    percentage = (total_points / max_points) * 100
    rounded_percentage = int((percentage // 10) * 10)
    
    logger.info(f"Raw score: {percentage:.2f}%, Rounded: {rounded_percentage}%")
    return rounded_percentage

def load_prompt_template(filename: str) -> str:
    """Load prompt template from file with robust path handling.
    
    Args:
        filename: Name of the prompt template file
        
    Returns:
        str: Content of the prompt template file
    """
    possible_paths = [
        filename,
        os.path.join("GeminiAPI", filename),
        os.path.join(os.path.dirname(__file__), filename)
    ]
    
    for path in possible_paths:
        try:
            with open(path, "r") as file:
                return file.read()
        except FileNotFoundError:
            continue
    
    raise FileNotFoundError(f"Could not find prompt template: {filename}")

def prepare_prompt(resume: str, tech_stack: str, difficulty: Union[int, str], 
                  question_count: Union[int, str]) -> str:
    """Prepare prompt for generating interview questions.
    
    Args:
        resume: Candidate's resume text
        tech_stack: Technologies to focus on
        difficulty: Difficulty level (1-5)
        question_count: Number of questions to generate
        
    Returns:
        str: Formatted prompt
    """
    try:
        prompt_template = load_prompt_template("prompt_question.txt")
    except FileNotFoundError as e:
        logger.error(f"Failed to load question prompt template: {e}")
        raise
    
    # Validate inputs
    if not resume or not tech_stack:
        raise ValueError("Resume and tech stack must not be empty")
    
    try:
        difficulty = int(difficulty)
        if not 1 <= difficulty <= 5:
            raise ValueError("Difficulty must be between 1 and 5")
    except ValueError:
        logger.warning(f"Invalid difficulty value: {difficulty}, defaulting to 3")
        difficulty = 3
        
    try:
        question_count = int(question_count)
        if not 1 <= question_count <= 20:
            raise ValueError("Question count must be between 1 and 20")
    except ValueError:
        logger.warning(f"Invalid question count: {question_count}, defaulting to 5")
        question_count = 5

    # Create a LangChain prompt template
    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["resume", "tech_stack", "difficulty", "question_count"]
    )
    
    return prompt.format(
        resume=resume,
        tech_stack=tech_stack,
        difficulty=str(difficulty),
        question_count=str(question_count)
    )

def prepare_prompt_for_answercheck(question_answer_pair: Dict[str, str]) -> str:
    """Prepare prompt for checking answers to interview questions.
    
    Args:
        question_answer_pair: Dictionary mapping questions to answers
        
    Returns:
        str: Formatted prompt for answer evaluation
    """
    if not question_answer_pair:
        raise ValueError("Question-answer pairs cannot be empty")
    
    try:
        prompt_template = load_prompt_template("prompt_evaluation.txt")
    except FileNotFoundError as e:
        logger.error(f"Failed to load evaluation prompt template: {e}")
        raise
    
    # Format the question-answer pairs for the prompt
    qa_formatted = ""
    for question, answer in question_answer_pair.items():
        if not question.strip() or not answer.strip():
            logger.warning(f"Skipping empty question or answer: Q: '{question}', A: '{answer}'")
            continue
        qa_formatted += f"Question: {question}\nAnswer: {answer}\n\n"
    
    if not qa_formatted:
        raise ValueError("No valid question-answer pairs provided")
    
    # Create and format the prompt
    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["qa_pairs"]
    )
    
    return prompt.format(qa_pairs=qa_formatted)

def get_questions(prompt: str) -> List[str]:
    """Generate interview questions based on the prompt.
    
    Args:
        prompt: Formatted prompt for question generation
        
    Returns:
        List[str]: Generated interview questions
    """
    try:
        llm = get_llm()
        
        # Create a prompt that will format the output correctly
        questions_prompt = PromptTemplate(
            template=prompt + "\n\nSeparate each question with 'QQQ'. Don't include any newlines in the questions.",
            input_variables=[]
        )
        
        # Use the modern pipe syntax
        chain = questions_prompt | llm
        response = chain.invoke({})
        
        # Extract the content from the AIMessage object
        response_text = response.content
        
        # Process the response
        questions = response_text.split('QQQ')
        questions = [question.strip() for question in questions if question.strip()]
        
        if not questions:
            logger.warning("No questions were generated")
            return []
        
        logger.info(f"Generated {len(questions)} questions")
        return questions
    except Exception as e:
        logger.error(f"Error generating questions: {e}")
        raise

def get_evaluation(prompt: str) -> int:
    """Evaluate answers to interview questions and return a score.
    
    Args:
        prompt: Formatted prompt for answer evaluation
        
    Returns:
        int: Percentage score (0-100, rounded to nearest 10)
    """
    try:
        llm = get_llm()
        
        evaluation_prompt = PromptTemplate(
            template=prompt + "\n\nFor each answer, provide EXACTLY ONE classification from: 'Incorrect', 'Partially correct', or 'Completely correct'. Separate classifications with 'QQQ'.",
            input_variables=[]
        )
        
        chain = evaluation_prompt | llm
        response = chain.invoke({})
        
        # Extract the content from the AIMessage object
        response_text = response.content
        
        # Log the raw response for debugging
        logger.debug(f"Raw model response: {response_text}")
        
        # Process the response more flexibly
        raw_evaluations = response_text.split('QQQ')
        
        # Normalize the evaluations to match our classification keys
        processed_evaluations = []
        for eval_result in raw_evaluations:
            eval_text = eval_result.strip().lower()
            
            if "completely correct" in eval_text or "correct" in eval_text and "partially" not in eval_text:
                processed_evaluations.append("Completely correct")
            elif "partially correct" in eval_text or "partial" in eval_text:
                processed_evaluations.append("Partially correct")
            elif "incorrect" in eval_text or "wrong" in eval_text:
                processed_evaluations.append("Incorrect")
            # Skip if we can't classify
        
        logger.info(f"Processed evaluations: {processed_evaluations}")
        
        if not processed_evaluations:
            logger.warning("No valid evaluations found in model response")
            return 0
        
        score = calculate_percentage(processed_evaluations, CLASSIFICATIONS)
        return score
    except Exception as e:
        logger.error(f"Error evaluating answers: {e}")
        raise EvaluationError(f"Failed to evaluate answers: {str(e)}")

def evaluate_candidate(resume: str, tech_stack: str, difficulty: int, 
                      question_count: int, answers: Dict[str, str]) -> Dict:
    """Complete end-to-end evaluation of candidate answers.
    
    Args:
        resume: Candidate's resume text
        tech_stack: Technologies to focus on
        difficulty: Difficulty level (1-5)
        question_count: Number of questions
        answers: Dictionary mapping questions to answers
        
    Returns:
        Dict: Evaluation results including score and feedback
    """
    try:
        evaluation_prompt = prepare_prompt_for_answercheck(answers)
        score = get_evaluation(evaluation_prompt)
        
        return {
            "score": score,
            "feedback": get_feedback_for_score(score),
            "evaluated_answers": len(answers),
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Evaluation failed: {e}")
        return {
            "score": None,
            "feedback": None,
            "error": str(e),
            "status": "error"
        }

def get_feedback_for_score(score: int) -> str:
    """Generate feedback based on the evaluation score.
    
    Args:
        score: Percentage score (0-100)
        
    Returns:
        str: Feedback message
    """
    if score >= 90:
        return "Excellent! Candidate demonstrated comprehensive knowledge."
    elif score >= 70:
        return "Good performance. Candidate shows solid understanding with some room for improvement."
    elif score >= 50:
        return "Adequate performance. Candidate has basic knowledge but needs development in some areas."
    elif score >= 30:
        return "Below average. Candidate needs significant improvement in key areas."
    else:
        return "Poor performance. Candidate lacks fundamental understanding of the subject matter."

if __name__ == "__main__":
    # Test the functionality
    logger.info("Testing Groq LangChain implementation...")
    
    try:
        # Test basic evaluation
        test_qa = {
            'What are the 3 primary colors in the RGB color model?': 'Red, Green, and Blue',
            'What is Python?': 'Python is a high-level, interpreted programming language known for its readability and versatility.',
            'Explain the concept of object-oriented programming.': 'Object-oriented programming is a paradigm where code is organized around objects rather than functions and logic. It uses classes and objects to structure code.'
        }
        
        prompt = prepare_prompt_for_answercheck(test_qa)
        logger.info("Prompt prepared successfully.")
        
        score = get_evaluation(prompt)
        logger.info(f"Evaluation score: {score}%")
        logger.info(f"Feedback: {get_feedback_for_score(score)}")
        
    except Exception as e:
        logger.error(f"Test failed: {e}")