import requests
import json
import time
import os
from dotenv import load_dotenv
from bs4 import BeautifulSoup
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_ENDPOINT_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

def ask_gemini(post):
    headers = {
        "Content-Type": "application/json"
    }
    params = {
        "key": GEMINI_API_KEY
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": "given the following post, extract the content which would make up the part of the post and then the likes, comments count and give a relevant tag to the post too. return the data strictly as a json file "+ post}
                ]
            }
        ]
    }

    try:
        response = requests.post(GEMINI_ENDPOINT_URL, params=params, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        if "candidates" in result and result["candidates"]:
            return result["candidates"][0]["content"]["parts"][0]["text"][7:-3]
        else:
            return "No valid response from Gemini."
    except Exception as e:
        return f"API call failed: {e}"
 
with open("raw_posts.json", "r", encoding="utf-8") as f:
    posts = json.load(f)

data=[]

for post in posts:
    if "Feed post number" in str(post):
        soup = BeautifulSoup(post, 'html.parser')
        cleaned_post=soup.get_text().replace("\n", " ").replace("\t", " ").replace("\r", " ")
        parse=ask_gemini(cleaned_post)
        print(parse)
        data.append(parse)

with open("cleaned_posts.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)