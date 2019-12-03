import { LOGIN } from "../actions/types";

const INITIAL_VALUES = {
  currentUser: '',
  type: '',
  token: ''
};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, token: action.payload.token, type: action.payload.type, currentUser: action.payload.user};
    default:
      return state;
  }
};