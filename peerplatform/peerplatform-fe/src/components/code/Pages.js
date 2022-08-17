import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Room from './Room';
import Profile from '../profile_components/Profile'
import CodeEditor from '../code/CodeEditor'
import { useGlobalState } from '../../context/RoomContextProvider';
import SignupForm from './SignupForm';
import RoomList from './RoomList';

const Pages = () => {
  const [ state ] = useGlobalState();
  const room = state.selectedRoom;

  return (
    <Router>
      <Switch>
        <Route path={'/rooms/:roomId'}>
            {room?<Room room={room}/> : null}
        </Route>
        <Route path='/rooms'>
          {state.twilioToken? <RoomList /> : <SignupForm />}
        </Route>
        <Route path='/'>
          <SignupForm />
        </Route>
      </Switch>
    </Router>
  );
}

export default Pages;