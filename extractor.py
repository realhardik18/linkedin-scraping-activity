import json
from bs4 import BeautifulSoup
from utils import process_posts
with open('raw_posts.json',encoding='utf-8') as file:
    posts=json.load(file)    

raw_posts=[]
for post in posts[:1]:
    soup=BeautifulSoup(post,'html.parser')        
    raw_posts.append(soup.get_text())
#print(raw_posts)
process_posts(posts[:1])