#!/bin/bash

curl http://localhost:4000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-px-demo12345678" \
  -d '{
    "model": "gpt-4o-mini",
    "optimization_mode": "BALANCED",
    "messages": [
      {
        "role": "system",
        "content": "As an AI language model, please provide a clear answer."
      },
      {
        "role": "user",
        "content": "What is 2 + 2?"
      }
    ]
  }'
