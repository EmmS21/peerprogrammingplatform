import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { loginReducer } from "./components/login_components/LoginReducer";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    createUser: signupReducer,
    auth: loginReducer,
  });
export default createRootReducer;
