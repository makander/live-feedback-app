import { combineReducers } from "redux";

import auth from "./auth";
import errors from "./errors";
import room from "./room";

export default combineReducers({
  auth,
  errors,
  room
});
