import json
from bs4 import BeautifulSoup
from ollama import chat
import re

def extract_post_data(html_post):
    # Use Ollama to extract the main post content and like/comment counts
    extract_prompt = (
        "You are an AI assistant that extracts structured data from raw HTML of a social media post.\n"
        "Return a JSON object with the following fields:\n"
        "- content: The core message written by the user (ignore buttons, labels, UI, etc).\n"
        "- likes: Number of likes (integer).\n"
        "- comments: Number of comments (integer).\n"
        "Respond ONLY with a JSON object. No explanation, no formatting.\n"
    )

    try:
        response = chat(
            model="deepseek-r1:1.5b",
            messages=[
                {"role": "system", "content": extract_prompt},
                {"role": "user", "content": html_post}
            ]
        )
        data = json.loads(response["message"]["content"])
        return data
    except Exception as e:
        print("Ollama extraction failed:", e)
        return {
            "content": "",
            "likes": 0,
            "comments": 0
        }

def tag_post(content):
    prompt = (
    "You are an AI trained to classify social media posts into consistent high-level tags.\n"
    "You will be provided with the raw HTML content of a post with lot of other fluff.\n"
    "1. Extract the main post text — the core message written by the author and nothing else just what he posted.\n"
    "2. Based on the extracted text, return 2-3 relevant tags from the following list only:\n"
    "[career, motivation, productivity, AI, tech, personal development, management, hiring, business, sales, marketing, design, education, news, opinion]\n"
    "Respond ONLY with a JSON list of tags. Do not include explanations or any other text.\n"
    
)


    response = chat(
        model="deepseek-r1:1.5b",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": content}
        ]
    )

    try:
        tags = json.loads(response["message"]["content"])
        if isinstance(tags, list):
            return tags
    except Exception as e:
        print("Tagging failed:", e)
    return ["other"]

def process_posts(html_posts, output_file="structured_posts.json"):
    structured_data = []

    for index,post_html in enumerate(html_posts):
        print(f"Processing post {index + 1}/{len(html_posts)}")
        data = extract_post_data(post_html)
        data["tags"] = tag_post(data["content"])
        structured_data.append(data)
        print(data)        
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(structured_data, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(structured_data)} structured posts to {output_file}")
    return structured_data
