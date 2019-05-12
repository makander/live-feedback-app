import { TOGGLE_LIVE_SESSION, CREATE_ROOM, GUEST_JOINED_ROOM, CHANGE_SLIDER } from "../actions/types";

export const toggleLiveSession = (dispatch, roomName) => dispatch({ type: TOGGLE_LIVE_SESSION, value: roomName });
export const createRoom = (dispatch, roomParticipants) => dispatch({ type: CREATE_ROOM, value: roomParticipants });
export const joinedRoom = (dispatch) => dispatch({ type: GUEST_JOINED_ROOM });

export const sliderInput = (dispatch, sliderValue) => dispatch({ type: CHANGE_SLIDER, value: sliderValue });
