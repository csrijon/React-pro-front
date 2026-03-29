from google import genai

client = genai.Client(api_key="AIzaSyA_9AB-3YArVdWbspGLZqWEOkyE1-xfFjA")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Explain AI in simple words"
)

print(response.text)