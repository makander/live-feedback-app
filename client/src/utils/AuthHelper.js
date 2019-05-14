import axios from "axios";

export const setAuthToken = token => {
  console.log(token);
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common.Authorization = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common.Authorization;
  }
};

export const getConfirm = () => {
  const token = localStorage.getItem("jwtToken");
  if (token) return true;
  return false;
};

export const loggedIn = () => {
  const token = localStorage.getItem("jwtToken");
  if (token) return !!token;
  return false;
};

export const logout = () => {
  console.log("logout auth helper af");
};
