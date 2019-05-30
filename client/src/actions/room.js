import {
  GUEST_JOINED_ROOM,
  CHANGE_SLIDER,
  SESSION_STARTED,
  SESSION_STOPPED,
  SESSION_DETAILS,
  SET_SESSION_AVERAGE,
  CANCEL_SESSION,
  CREATE_ROOM,
  VOTING_INPUT,
  SET_VOTING_INPUT
} from "./types";

export const roomCreated = roomName => ({
  type: CREATE_ROOM,
  value: roomName
});
export const joinedRoom = (userId, roomConfig) => ({
  type: GUEST_JOINED_ROOM,
  payload: { userId: { value: userId }, roomConfig: { value: roomConfig } }
});
export const sliderInput = sliderValue => ({
  type: CHANGE_SLIDER,
  value: sliderValue
});
export const sessionStarted = roomName => ({
  type: SESSION_STARTED,
  value: roomName
});
export const sessionStopped = roomName => ({
  type: SESSION_STOPPED,
  value: roomName
});
export const setSessionAverage = roomAverageValue => ({
  type: SET_SESSION_AVERAGE,
  value: roomAverageValue
});
export const sessionDetails = () => ({ type: SESSION_DETAILS });
export const handleVotingInput = data => ({ type: VOTING_INPUT, value: data });
export const cancelSession = () => ({ type: CANCEL_SESSION });
export const setVotingInput = data => ({ type: SET_VOTING_INPUT, value: data });
