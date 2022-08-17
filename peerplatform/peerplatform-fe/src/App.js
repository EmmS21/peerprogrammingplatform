import React, { useRef, useEffect, useState } from 'react';
import { useLocation, Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
import ReactGA from 'react-ga';
import Login from './components/login_components/Login';
import Header from './components/login_components/Header';
import Signup from './components/signup_components/Signup';
import Profile from './components/profile_components/Profile';
import AdminLayout from "./layouts/Admin.js";
import CodeEditor from './components/code/CodeEditor';
import Timer from './components/profile_tabs/ClockCounter';
import LayoutDefault from './layouts/LayoutDefault';
import Home from './views/Home';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
//we can probably deconstruct these to a one-liner
import Pages from './components/code/Pages';
import { RoomContextProvider, useGlobalState } from './context/RoomContextProvider';
import RoomList from './components/code/RoomList';
import SignupForm from './components/code/SignupForm';
import Room from './components/code/Room';

// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_CODE);

const trackPage = page => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};


const App = () => {

  const childRef = useRef();
  let location = useLocation();
//  const [ state ] = useGlobalState();
//  const room = state.selectedRoom;
//  console.log('inside pages', room)

//  const room = state.selectedRoom;

  useEffect(() => {
    const page = location.pathname;
    document.body.classList.add('is-loaded')
    childRef.current.init();
    trackPage(page);
  }, [location]);

  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <Switch>
            <AuthProvider>
                <Header/>
                <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
                <AppRoute exact path="/login" component={Login} />
                <AppRoute exact path="/signup" component={Signup} />
                <AppRoute exact path="/code_editor" component={CodeEditor} />
                <AppRoute exact path="/timer" component={Timer} />
                <RoomContextProvider useGlobalState={ useGlobalState }>
                    <AppRoute exact path="/rooms" component={RoomList} />
                    <PrivateRoute exact path="/profile" component={Profile} render={(props) => <AdminLayout {...props} />} />
                    <AppRoute exact path="/rooms/:roomId" component={Room} />
                </RoomContextProvider>
            </AuthProvider>
        </Switch>
      )} />
  );
}

export default App;
<<<<<<< HEAD
//
//        <Route path='/rooms'>
//          {state.twilioToken? <RoomList /> : <SignupForm />}
//        </Route>
//                <RoomContextProvider>
//                    <div>
//                        <Pages />
//                    </div>
//                </RoomContextProvider>
=======


//  <Elements stripe={stripePromise}>
>>>>>>> parent of 96faf56 (joining rooms approach)
