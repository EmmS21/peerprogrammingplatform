<<<<<<< HEAD
# Project Description
Pair programming platform randomly matching similarly skilled users to solve timed randomly generated programming challenges

# How it works
Users can signup creating a profile click on a button immediately matching them to another user. This action redirects the user to a code-editor and initiates an audio voice chat between both matched users. These users are then given a predefined period of time to solve randomly retrieved programming challenges.

### Purpose
This platform is designed to enable bootcamp students and other learners better prepare for technical interviews through pair programming. The process helps users get more comfortable communicating their logic to other stakeholders while simultaneously improving their problem-solving skills.

## Backend
The backend is built on Django and comprises three apps; accounts, signup and voice_chat

### Accounts: 
The accounts folder/app comprises of two models; 1 being an extension of the custom Django user model enabling us to store additional information about a user namely their city, country, bio and profile picture. The accounts model also comprises of a model enabling us to create and store programming challenges. These models are registered in admin.py in order for us to interact with these data-tables in the admin panel.

#### Signup: 
Signup primarily houses the code creating an API to be consumed by our React frontend app. Our API enables us to create a user and edit their profile information. `urls.py` contains all API endpoints related to our API

#### Voice Chat: 
Voice chat contains all backend code pertaining to our drop in audio chat. The file `urls.py` contains all API end points related to this API.

## FrontEnd
The front end is built purely on React. All code related to the frontend is contained in the folder; `peerplatform-fe`.

Inside `src` you will find these folders:

## Process: 

Users signup, creating a new user profile. Authentication is token based and handled using Redux. Once users have been authenticated they are redirected back to the Home Page.

Users have access to the User profile, this is a protected view that is only accessible for authenticated users. Once users click on their profile, they have the abilty to update their profile information. Specifically, users can update their; profile picture, first name, last name and location.

Users who wish to pair program can click on the 'Join Waiting Room' button. This component, sends a list of all users who are ready to be matched to a Redis cache, retrieves this list and sets the local state with a list of all users available for a pair programming session. This component also interacts with a RESTful API creating a Twilio token for each user.

Once the state has been updated, the user is redirected to the waiting room. Here the user is matched with another user waiting to be matched, requests are made to a RESTful API instructing Twilio to create a conference call named after the two matched users. These users are redirected to their respective pair programming sessions.

Upon navigating to their pair programming sessions, a Twilio conference call commencces connecting the two matched users. Based on the time of the day, one of the users is selected as the 'Driver' of the pair programming session. The Driver is responsible for writing the code in the online IDE, while the observer has read only access to the IDE. The Driver selects a level of difficulty for the programming challenge. This triggers a 'GET' request to a RESTful API in Django that interacts with a MongoDB database containing 2000 programming challenges. Depending on the level of difficulty selected, the backend interacts with a custom end point that triggers a SQL script that will retrieve a random programming challenge from the DB. This is received in the backend and sent back to the frontend. 

When the Driver receives the programming challenge, the challenge is sent to the observer through a websocket, with an event listener waiting for a specific signal to read and update one of the states for the observer storing the programming challenge. This is then rendered on the observer's side bar.

When the Driver types into the IDE, we wait for the Driver to stop typing for a few seconds before sending the code typed into the IDE through the websocke to the observer in order to synchronize states between both users ensuring the observer sees the code the Driver has typed into the IDE.

## Files outside of folders

`App.js`: Redirected users to different components based on url
`App.test.js`: Need to create tests
`AxiosApi.js`: Axios create with auth tokens
`index.js`: Renders `App.js`
`Reducer.js`: Combining signup and login reducers
`Root.js`: Set local storage with auth token if empty upon signup
`routes.js`: Routes for profile page and Table


# Technologies/Frameworks
Built using: Django, React and Redis

Django Dependencies: `requirements.txt` (Let me know if there are packages not included in requirements.txt)

# Road Map

## Collate user feedback and make changes
The current priority is to test the platform with live users, collate their feedback and fix any major issues that need to be resolved to get the platform more functional. This will include UI changes based on what users find more appealing and what is realistically feasible to implement

## Testing
Programmatically test; if the Twilio call is actually starting when two users are matched, if users are receiving the programming challenge, if the code editor terminal produces the expected output based on the code executed, if users can update their profile picture, if users are not receiving the same programming challenge over and over again, if the matching process works as intended in all circumstances

## Leadership Board
When users complete the pair programming session, they get rated by their peers on communication + collaboration + problem solving skills. I would like to build a real time leadership board to show how users rank and include the feature to filter for users in the leadership board by bootcamp/college + have a total ranking for each college/bootcamp (this is further down the line)
Possible Solutions: ElastiCache for Redis

## Autograder (Maybe)
Building or integrating an existing autograder to test whether code executed produces expected output

## User Dashboard
Enable users to track their pair programming session scores and be able to visualize which questions they do better in/struggle with. This would require tagging questions I have by category (ie. binary search tree, linkedlist, dynamic programming etc.)

## Tool Related Challenges
Enable users to select between receiving Leetcode style questions versus questions based on specific tools. So if for example you chose React; you would get a question regarding debugging some React related issue (would need to see how feasible this is)

## Refactor Old Code
Improve efficiency, remove redundancy and clean up code.


```
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

#Built by: Emmanuel Sibanda
