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
    browser.find_element(By.ID, "joinroom").click()    
    sleep(45)

number_of_threads = 6
threads = []
for num in range(number_of_threads):
    t = Thread(target = funct, args =(num, ))
    t.start()
    threads.append(t)
