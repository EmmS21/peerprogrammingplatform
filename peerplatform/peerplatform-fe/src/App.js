import React, { useRef, useEffect } from 'react';
import { useLocation, Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
import ReactGA from 'react-ga';
import Login from './components/login_components/Login';
import Header from './components/login_components/Header';
import Signup from './components/signup_components/Signup';
import Profile from './components/profile_components/Profile'
import AdminLayout from "./layouts/Admin.js"
//import CodeEditor from './editor-ui/src/App.vue'
import CodeEditor from './components/code/CodeEditor'
import Timer from './components/profile_tabs/ClockCounter';
//import Dashboard from './views/Dashboard';
//import { VueWrapper } from 'vuera'

// Layouts
import LayoutDefault from './layouts/LayoutDefault';

// Views 
import Home from './views/Home';

import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_CODE);

const trackPage = page => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

const App = () => {

  const childRef = useRef();
  let location = useLocation();

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
                <PrivateRoute exact path="/profile" component={Profile} render={(props) => <AdminLayout {...props} />} />
            </AuthProvider>
        </Switch>
      )} />
  );
}

export default App;
