import {
  TOGGLE_LIVE_SESSION,
  CREATE_ROOM,
  GUEST_JOINED_ROOM,
  CHANGE_SLIDER,
  SESSION_STARTED,
  SESSION_STOPPED
} from "../actions/types";

const initialState = {
  session_live: false,
  room_name: null,
  rooms: [],
  joined_room: false,
  slider_value: "5",
  session_active: false,
  session_user_id: null
};

export default function(state = initialState, action) {
  console.log("reducer running", action);
  switch (action.type) {
    case TOGGLE_LIVE_SESSION:
      return {
        ...state,
        session_live: !state.session_live,
        room_name: action.value
      };
    case CREATE_ROOM:
      return {
        ...state,
        rooms: action.value,
        joined_room: true
      };
    case GUEST_JOINED_ROOM:
      return {
        ...state,
        joined_room: true,
        session_user_id: action.value
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

    default:
      return state;
  }
}
