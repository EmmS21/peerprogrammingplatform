import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RoomList from './RoomList';
import Room from './Room';
import SignupForm from './SignupForm'
import { useGlobalState } from '../../context/RoomContextProvider';

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