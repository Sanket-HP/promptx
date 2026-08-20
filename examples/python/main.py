# Python example using standard openai library pointing to PromptX Gateway
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("PROMPTX_API_KEY", "sk-px-demo12345678"),
    base_url="http://localhost:4000/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain token optimization in 2 sentences."}
    ]
)

print("Response:", response.choices[0].message.content)
