import { Route, Redirect } from "react-router-dom";
import React from "react";
//fyi this is called destructuring
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

//check if user is authenticated else redirect to login if user visits profile page
const PrivateRoute = ({ children, ...rest }) => {
  //we need to check for authentication based on what is in our state
  //if we have a user then allow user to see this page
  let { user } = useContext(AuthContext);
  return <Route {...rest}>{!user ? <Redirect to="/login" /> : children}</Route>;
};
export default PrivateRoute;
