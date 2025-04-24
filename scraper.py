from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import json
import time

PAGE_URL = "https://www.linkedin.com/in/chrisorlob/recent-activity/all/"

def get_driver():
    options = Options()
    #options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--log-level=3")
    return webdriver.Chrome(options=options)

with open('cookies.json', 'r') as file:
    cookies = json.load(file)

driver = get_driver()
driver.get("https://www.linkedin.com")
print('adding cookies..')

for cookie in cookies:
    if cookie.get("sameSite") not in ["Strict", "Lax", "None"]:
        cookie["sameSite"] = "Lax"
    driver.add_cookie(cookie)

print('added all {} cookies'.format(len(cookies)))
driver.get(PAGE_URL)
time.sleep(5)

SCROLL_PAUSE_TIME = 4
for i in range(10):
    print(f"Scrolling... ({i+1}/10)")
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(SCROLL_PAUSE_TIME)

# Parse the page after scrolling
soup = BeautifulSoup(driver.page_source, 'html.parser')
posts = soup.find_all("li", {"class": "HzDsNelEKxZBQWYVWlrFPdmLIqMRsWNDSrSdE"})  # Update this selector if it changes
html_posts = [str(post) for post in posts]

with open("raw_posts.json", "w", encoding="utf-8") as f:
    json.dump(html_posts, f, ensure_ascii=False, indent=2)

print(f"Saved {len(html_posts)} HTML posts to raw_posts.json")

driver.quit()
