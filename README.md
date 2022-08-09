<<<<<<< HEAD
# Project Description
Pair programming platform randomly matching similarly skilled users to solve timed randomly generated programming challenges

# How It Works
Users can sign up by creating a profile then clicking on a button which immediately matches them to another user. This action redirects the user to a code editor and initiates an audio voice chat between both matched users. These users are then given a predefined period of time to solve randomly retrieved programming challenges.

### Purpose
This platform is designed to enable bootcamp students and other learners to better prepare for technical interviews through pair programming. The process helps users get more comfortable communicating their logic to other stakeholders while simultaneously improving their problem-solving skills.

## Backend
The backend is built on Django and comprises three apps: accounts, signup, and voice_chat.

### Accounts: 
The accounts folder/app comprises two models: 1 being an extension of the custom Django user model, enabling us to store additional information about a user, namely their city, country, bio and profile picture. The accounts model also comprises a model enabling us to create and store programming challenges. These models are registered in admin.py in order for us to interact with these data tables in the admin panel.

#### Signup: 
Signup primarily houses the code creating an API to be consumed by our React front-end app. Our API enables us to create a user and edit their profile information. `urls.py` contains all API endpoints related to our API.

#### Voice Chat: 
Voice chat contains all backend code pertaining to our drop-in audio chat. The file `urls.py` contains all API end points related to this API.

## FrontEnd
The front-end is built purely on React. All code related to the front-end is contained in the folder `peerplatform-fe`.

Inside `src` you will find these folders:

### Assets:
This folder contains all css and scss used to style this project along with images rendered in our front-end. In most cases the name of the css/scss stylesheet denotes which file this stylesheet is relevant to.

### Axios:
This folder currently contains code related to making an axios call to our Django server with authentication tokens included.

### Components:
Contains all components created. Components are mostly grouped by their functional purpose on the platform. 

##### Code: 
All components related to the coding_editor. Specifically:

`CodeEditor`: A code-editor built using the brace package (Ace Editor). Code written is sent to Judge0, an online code execution system, returning a token which is then resent to Judge0 in order to receive our code's output.

- Brace Documentation: https://www.npmjs.com/package/react-brace
- Judge0 Documentation: https://ce.judge0.com/

`NewRoom`: Renders a new audio chat room (work in progress).

`Pages`: Routers pertaining to our audio chat functionality (work in progress, will be moved to a different folder)

`Programming Challenges`: Component rendering programming challenges from our database

`Room, RoomList, SignupForm`: All pertaining to our audio chat functionality (work in progress, will be refactored)

`Spinner`: A spinner shown on our CodeEditor while we wait for a response from Judge0

##### Elements:
Elements used in some components (Profile and Home Page in particular). (Will be refactored)

##### Layout:
Similar to elements, but specifically related to our Headers and Footers

##### Login_components:
`Login`: Renders our login page. (Not yet done: front-end validation)

`LoginActions`: All Axios functions pertaining to our login functionality, i.e., sending login details to Django, receiving tokens, and redirecting users to appropriate point (name should probably be changed).

`LoginReducer`: Actions to be carried out when user attempts to login, i.e., set token and set current user.

`LoginTypes`: Types of actions that are carried out when a user attempts to login.

`Logout`: Clearing tokens from localStorage and redirecting user to home page.

##### Navbars
Navigation bar on profile page (needs to be refactored)

##### Profile Components
Components relevant to profile page

`Profile`: renders profile page

`StartModal`: The idea behind this was to create a modal that would appear when a user clicks `Start Coding`. The modal is supposed to be a multi-step form (not requiring any user input) walking users through how the platform works (work in progress, do we need this?)

`useModalCustomHook`: Related to the above code

##### Profile Tabs
A clockcounter counting down from when users start off the pair programming session. The clock counter. This clock counter runs through 4 phases, controlling the tab selected.

`ClockCounter`: The clockcounter itself
`ProfileTab`: The tab showing the user what phase of the pair programming session they are in, based on the ClockCounter.

##### Sections
Includes sections relevant to the home page, i.e., Testimonials, Pricing Table sections, etc.

##### SideBar
SideBar shown on home page

##### Signup Components
Components relevant to rendering the signup page (CountryList is not currently in use - this was supposed to enable users to select their country from a list of countries - this might not be useful for the platform overall.)

### Context:

##### AuthContext:
- Passes down props to multiple components
- Axios function to login user, Axios function to refresh tokens, Axios function to carry out `PUT` request to update user profile (need to look at this again), Axios function to log user off and Axios function to make a `GET` request to retrieve a random programming challenge from the database.

##### RoomContextProvider:
- Initializing states related to audio drop in chat (work in progress).

### Hooks:
- (Work in Progress - related to audio drop in chat)

### Layouts:
More layouts related to Home page

### Routes:
Defining protected routes for Profile page (should include code editor)

### Utils:
Defining private routes and other routes (i.e. AppRoute). Also other files related to access tokens and scroll effects.

### Views
`Home`: renders home page
`Table`: Profile page table - not currently in use. This will eventually be used to show user score based on peer ratings.

## Files outside of folders

`App.js`: Redirected users to different components based on url
`App.test.js`: Need to create tests
`AxiosApi.js`: Axios create with auth tokens
`index.js`: Renders `App.js`
`Reducer.js`: Combining signup and login reducers
`Root.js`: Set local storage with auth token if empty upon signup
`routes.js`: Routes for profile page and Table


# Technologies/Frameworks
Built using: Django and React

Django Dependencies: `requirements.txt` (Let me know if there are packages not included in requirements.txt.)

# How to run
Clone and run the following commands. You will need to install ngrok to interact with Twilio Programming Voice API.
With ngrok specifically, you will need to expose the server to ngrok by running ngrok http <portName>. 

- project is contained inside folder peerplatform (remember to cd into peerplatform - will rectify this issue.)
- https://ngrok.com/
- What is ngrok? -> 'Ngrok is a cross-platform application that exposes local server ports to the Internet.'

```
pip install -r requirements.txt
python manaage.py makemigrations
python manage.py migrate
python manage.py runserver
```


# For Collaborators
Project roadmap is contained in peerplatform/ProjectRoadMap.md


# Built by: Emmanuel Sibanda


>>>>>>> 39affa0 (initial commit)

>>>>>>> b763871ec2007342378648b1fbc7db028ab7d9ff
