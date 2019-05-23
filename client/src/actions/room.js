import {
  TOGGLE_LIVE_SESSION,
  GUEST_JOINED_ROOM,
  CHANGE_SLIDER,
  SESSION_STARTED,
  SESSION_STOPPED,
  SESSION_DETAILS,
  SET_SESSION_AVERAGE
} from "./types";

export const toggleLiveSession = (dispatch, roomName) =>
  dispatch({ type: TOGGLE_LIVE_SESSION, value: roomName });
export const joinedRoom = (dispatch, userId) =>
  dispatch({ type: GUEST_JOINED_ROOM, value: userId });
export const sliderInput = (dispatch, sliderValue) =>
  dispatch({ type: CHANGE_SLIDER, value: sliderValue });
export const sessionStarted = (dispatch, roomName) =>
  dispatch({ type: SESSION_STARTED, value: roomName });
export const sessionStopped = (dispatch, roomName) =>
  dispatch({ type: SESSION_STOPPED, value: roomName });
export const setSessionAverage = (dispatch, roomAverageValue) =>
  dispatch({ type: SET_SESSION_AVERAGE, value: roomAverageValue });
export const sessionDetails = dispatch => dispatch({ type: SESSION_DETAILS });
