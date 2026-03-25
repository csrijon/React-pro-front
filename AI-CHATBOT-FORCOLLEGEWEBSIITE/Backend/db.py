from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["college_chatbot"]
collection = db["chat_history"]