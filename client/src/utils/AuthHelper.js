import axios from "axios";

export const setAuthToken = token => {
  console.log("this is token from auth Helper", token);
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common.Authorization = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common.Authorization;
  }
};

export const getConfirm = async () => {
  const token = localStorage.getItem("jwtToken");
  if (token)  {
    try {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/validate`)
      } catch (error) {
        console.error(error);
      }
    }
};

export const loggedIn = () => {
  const token = localStorage.getItem("jwtToken");
  if (token) return !!token;
  return false;
};

export const logout = () => {
  console.log("logout auth helper af");
};
