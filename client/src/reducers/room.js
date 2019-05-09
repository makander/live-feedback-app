import { TOGGLE_LIVE_SESSION } from "../actions/types";

const initialState = {
  session_live: false
};

export default function(state = initialState, action) {
  console.log("reducer running", action);
  switch (action.type) {
    case TOGGLE_LIVE_SESSION:
    console.log(state);
      return {
        ...state,
        session_live: !state.session_live,
      };

    default:
      return state;
  }
}

