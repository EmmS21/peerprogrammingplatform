import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RoomList from './RoomList';
import Room from './Room';
import SignupForm from './SignupForm'
import Profile from '../profile_components/Profile'
import CodeEditor from '../code/CodeEditor'
import { useGlobalState } from '../../context/RoomContextProvider';

const Pages = () => {
  const [ state ] = useGlobalState();
  const room = state.selectedRoom;
  console.log('inside pages', room)

  return (
    <Router>
      <Switch>
        <Route path={'/rooms/:roomId'}>
            {room?<Room room={room}/> : null}
        </Route>
      </Switch>
    </Router>
  );
}


export default Pages;