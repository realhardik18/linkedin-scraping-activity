import json
with open('cleaned_posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

data=[]
for post in posts:
    p=eval(post[:-1].replace("\n",''))
    if 'comments' not in p.keys():
        p['comments'] = 0
    cp={
        "content":p['post_content'],
        "tag":p['tag'],
        "comments_count":p['comments'],
        "likes":p["likes"]
    }
    data.append(cp)
with open("content.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("done")