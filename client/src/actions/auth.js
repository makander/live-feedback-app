import axios from "axios";
// eslint-disable-next-line camelcase
import jwt_decode from "jwt-decode";
import { setAuthToken } from "../utils/AuthHelper";

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

// Set logged in user
export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
});

// User loading
export const setUserLoading = () => ({
  type: USER_LOADING
});

// Login - get user token
export const loginUser = userData => dispatch => {
  console.log("login from actions auth");
  axios
    .post(`${process.env.REACT_APP_API_BASE_URL}/api/users/login`, userData)
    .then(res => {
      // Set token to localStorage
      const { token } = res.data.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      return dispatch({
        type: GET_ERRORS,
        payload: err.response ? err.response.data : {}
      });
    });
};
// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post(`${process.env.REACT_APP_API_BASE_URL}/api/users/register`, userData)
    .then(() => {
      history.push("/login");
    })
    .catch(err => {
      return dispatch({
        type: GET_ERRORS,
        payload: err.response ? err.response.data : {}
      });
    });
};

// Log user out
export const logoutUser = () => dispatch => {
  axios
    .get(`${process.env.REACT_APP_API_BASE_URL}/api/users/logout`)
    .then(res => {
      // this should be handled better
      console.log(res.data.msg);
    })
    .catch(err => {
      return dispatch({
        type: GET_ERRORS,
        payload: err.response ? err.response.data : {}
      });
    });
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser());
};

export const isAuthenticated = dispatch => {
  const token = localStorage.getItem("jwtToken");
  // Set token to Auth header
  setAuthToken(token);
  // Decode token to get user data
  const decoded = jwt_decode(token);
  // Set current user
  dispatch(setCurrentUser(decoded));
};
