import pandas as pd
from db import collection
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# OpenRouter AI setup
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    default_headers={
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "JIS College Chatbot"
    }
)

# Load CSV
data = pd.read_csv("college_data.csv")

college_keywords = [
    "jis", "college", "bca", "mca", "btech", "mba", "bba",
    "fees", "hostel", "placement", "admission", "course",
    "campus", "library", "principal", "department", "stream",
    "percentage", "package", "salary", "company", "recruiter",
    "engineering", "cse", "ece", "civil", "mechanical"
]

# Check if question is college related
def is_college_related(message):
    for word in college_keywords:
        if word in message.lower():
            return True
    return False

# AI response
def ask_ai(question):
    try:
        response = client.chat.completions.create(
            model="liquid/lfm-2.5-1.2b-thinking:free",
            messages=[
                {
                    "role": "system",
                    "content": "You are a chatbot for JIS College only. Answer only JIS College related questions like courses, fees, placement, hostel, admission, campus."
                },
                {
                    "role": "user",
                    "content": question
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        print("AI ERROR:", e)
        return "Sorry, AI service is not available right now."
def get_bot_response(message):
    msg = message.lower().strip()
    words = msg.split()

    if not is_college_related(msg):
        return "I only provide information about JIS College."

    # Exact match
    for index, row in data.iterrows():
        question = str(row["question"]).lower().strip()
        if msg == question:
            response = row["answer"]
            collection.insert_one({"user_message": message, "bot_response": response})
            return response

    # Keyword match (important)
    for index, row in data.iterrows():
        question = str(row["question"]).lower().strip()
        question_words = question.split()

        match_count = 0
        for word in question_words:
            if word in words:
                match_count += 1

        # If most words match → return answer
        if match_count >= len(question_words) / 2:
            response = row["answer"]
            collection.insert_one({"user_message": message, "bot_response": response})
            return response

    # AI fallback
    ai_response = ask_ai(message)
    collection.insert_one({"user_message": message, "bot_response": ai_response})
    return ai_response