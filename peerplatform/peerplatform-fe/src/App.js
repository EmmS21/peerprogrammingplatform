import React, { useRef, useEffect } from "react";
import {
  useLocation,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";
import AppRoute from "./utils/AppRoute";
import ScrollReveal from "./utils/ScrollReveal";
import ReactGA from "react-ga";
import Login from "./components/login_components/Login";
import Header from "./components/login_components/Header";
import Signup from "./components/signup_components/Signup";
import Profile from "./components/profile_components/Profile";
import AdminLayout from "./layouts/Admin.js";
import CodeEditor from "./components/code/CodeEditor";
import Timer from "./components/profile_tabs/ClockCounter";
import LayoutDefault from "./layouts/LayoutDefault";
import Home from "./views/Home";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import {
  RoomContextProvider,
  useGlobalState,
} from "./context/RoomContextProvider";
import Room from "./components/code/Room";
import JoinRoom from "./components/code/JoinRoom";
import CheckoutForm from "./components/payments/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import TestComponent from "./components/code/Test";

ReactGA.initialize(process.env.REACT_APP_GA_CODE);

const trackPage = (page) => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

const App = () => {
  const childRef = useRef();
  let location = useLocation();
  const stripePromise = loadStripe(
    "pk_test_51LDT6uDMftTw233MKgmBwD3btGNBmCyhvqPJ6qJh1bvudRNl4xATE4gDL1kaPZYxcPD0uan3sx2ttXawUkjQelaO00qJ51XHLo",
  );

  const options = {
    clientSecret:
      "sk_test_51LDT6uDMftTw233M9XAwYdnCvLBDNBUIqWNU4gwGVu2BzwcY6cimqpRH78ZLogDoWnJ4zD4M8JJDJj54NagRrVQl00onyo8Lqu",
  };

  useEffect(() => {
    const page = location.pathname;
    document.body.classList.add("is-loaded");
    childRef.current.init();
    trackPage(page);
  }, [location]);

  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <Switch>
          <AuthProvider>
            <RoomContextProvider useGlobalState={useGlobalState}>
              <Header />
              <AppRoute
                exact
                path="/"
                component={Home}
                layout={LayoutDefault}
              />
              <AppRoute exact path="/login" component={Login} />
              <AppRoute exact path="/signup" component={Signup} />
              <AppRoute exact path="/code_editor" component={CodeEditor} />
              <AppRoute exact path="/tester" component={TestComponent} />
              <AppRoute exact path="/timer" component={Timer} />
              <AppRoute path="/join/:roomName" component={JoinRoom} />
              <Elements stripe={stripePromise}>
                <AppRoute
                  exact
                  path="/payments"
                  component={CheckoutForm}
                  options={options}
                />
              </Elements>
              <AppRoute exact path="/rooms/:roomName" component={Room} />
              <PrivateRoute
                exact
                path="/profile"
                component={Profile}
                render={(props) => <AdminLayout {...props} />}
              />
            </RoomContextProvider>
          </AuthProvider>
        </Switch>
      )}
    />
  );
};

export default App;
