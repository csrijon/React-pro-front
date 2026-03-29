from db import collection
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ask_ai(question):
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a helpful AI chatbot."},
                {"role": "user", "content": question}
            ],
            temperature=0.7,
            max_tokens=1024
        )

        return completion.choices[0].message.content

    except Exception as e:
        print("Groq Error:", e)
        return "AI server error."


def get_bot_response(message):
    try:
        ai_response = ask_ai(message)

        try:
            collection.insert_one({
                "user_message": message,
                "bot_response": ai_response
            })
        except Exception as db_error:
            print("MongoDB Error:", db_error)

        return ai_response

    except Exception as e:
        print("CHATBOT ERROR:", e)
        return "Server error."