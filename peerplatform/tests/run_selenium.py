from time import sleep

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from threading import Thread

chrome_options = Options()
chrome_options.add_argument('--headless')
# browser = webdriver.Chrome(chrome_options=chrome_options)
user_names = ["emmanuelS21", "testingUser", "newUserNow", "testing99", "newUser90", "emmanuelS212"]
passwords = ["K@leidoscope69","P@ssword21","P@ssword21","P@ssword21","P@ssword21","P@ssword21"]
# count = 0

tab_names = ['https://peerprogrammingplatform.vercel.app/login', 'https://peerprogrammingplatform.vercel.app/login', 'https://peerprogrammingplatform.vercel.app/login', 'https://peerprogrammingplatform.vercel.app/login', 'https://peerprogrammingplatform.vercel.app/login', 'https://peerprogrammingplatform.vercel.app/login']

def funct(num):
    browser = webdriver.Chrome()
    browser.get('https://peerprogrammingplatform.vercel.app/login')
    browser.find_element(By.ID, "name-field").send_keys(user_names[num])
    browser.find_element(By.ID, "password-field").send_keys(passwords[num]) 
    browser.find_element(By.ID, "login-button").click()
    sleep(2)
    browser.find_element(By.ID, "dashboard-button").click()
    sleep(2)
    browser.find_element(By.XPATH('//button[normalize-space()="Join Waiting Room"]')).click()    
    sleep(15)

number_of_threads = 6
threads = []
for num in range(number_of_threads):
    t = Thread(target = funct, args =(num, ))
    t.start()
    threads.append(t)

# users = {
#     "emmanuelS21": "K@leidoscope69",
#     "testingUser": "P@ssword21",
#     "newUserNow": "P@ssword21",
#     "testing99": "P@ssword21",
#     "newUser90": "P@ssword21",
#     "emmanuelS212": "P@ssword21"
# }
# browser = webdriver.Chrome()
# browser.get('https://peerprogrammingplatform.vercel.app/login')

# for key in users:
#     try:
#         element = WebDriverWait(browser, 100).until(
#             EC.presence_of_element_located((By.ID, "name-field"))
#             # name_input = browser.find_element(By.ID, 'name-field')
#         )
#         element.send_keys(key)
#         browser.find_element(By.ID, 'password-field').send_keys(users[key])
#         second_element = WebDriverWait(browser, 100).until(
#             EC.presence_of_element_located((By.ID, 'login-button'))
#         )
#         second_element.click()
#         sleep(3)
#         browser.execute_script("window.open('https://peerprogrammingplatform.vercel.app/login')")
#         # sleep(10)
#         browser.find_element(By.ID, 'login-button').click()
#     finally:
#         browser.quit()

# password_input = browser.find_element(By.ID, 'password-field')
# find_element(By.ID, "field")

#threading - run tasks in parallel/running selenium in one go, doing things in parallel
