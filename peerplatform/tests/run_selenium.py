from time import sleep

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

browser = webdriver.Chrome()
browser.get('https://peerprogrammingplatform.vercel.app/login')
try:
    element = WebDriverWait(browser, 100).until(
        EC.presence_of_element_located((By.ID, "name-field"))
        # name_input = browser.find_element(By.ID, 'name-field')
    )
    element.send_keys('emmanuelS21')
    browser.find_element(By.ID, 'password-field').send_keys('K@leidoscope69')
    second_element = WebDriverWait(browser, 100).until(
        EC.presence_of_element_located((By.ID, 'login-button'))
    )
    second_element.click()
    # browser.find_element(By.ID, 'login-button').click()
    sleep(10)
finally:
    browser.quit()

# password_input = browser.find_element(By.ID, 'password-field')
# find_element(By.ID, "field")
