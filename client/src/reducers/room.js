import { TOGGLE_LIVE_SESSION, CREATE_ROOM, GUEST_JOINED_ROOM } from "../actions/types";

const initialState = {
  session_live: false,
  room_name: null,
  rooms: [],
  joined_room: false
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
        joined_room: true
      };

    default:
      return state;
  }
}

