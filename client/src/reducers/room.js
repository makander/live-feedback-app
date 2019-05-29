import {
  TOGGLE_LIVE_SESSION,
  GUEST_JOINED_ROOM,
  CHANGE_SLIDER,
  SESSION_STARTED,
  SESSION_STOPPED,
  SESSION_DETAILS,
  SET_SESSION_AVERAGE,
  VOTING_INPUT
} from "../actions/types";

const initialState = {
  session_live: false,
  room_name: null,
  joined_room: false,
  slider_value: "50",
  session_room_config: null,
  session_active: false,
  session_user_id: null,
  session_details: false,
  voting_input: null,
  session_average: "50"
};

export default function(state = initialState, action) {
  console.log("reducer running", action);
  switch (action.type) {
    case TOGGLE_LIVE_SESSION:
      return {
        ...state,
        session_live: true,
        room_name: action.value
      };
    case GUEST_JOINED_ROOM:
      return {
        ...state,
        joined_room: true,
        session_user_id: action.payload.userId.value,
        session_room_config: action.payload.roomConfig.value
      };
    case CHANGE_SLIDER:
      return {
        ...state,
        slider_value: action.value
      };
    case SESSION_STARTED:
      return {
        ...state,
        session_active: true
      };
    case SESSION_STOPPED:
      return {
        ...state,
        session_active: false
      };
    case SESSION_DETAILS:
      return {
        ...state,
        session_details: true
      };
    case SET_SESSION_AVERAGE:
      return {
        ...state,
        session_average: action.value
      };
    case VOTING_INPUT:
      return {
        ...state,
        voting_input: action.value
      };

    default:
      return state;
  }
}
