import { LOGIN } from "../actions/types";

const INITIAL_VALUES = {
  currentUser: JSON.parse(localStorage.getItem("user")) || "",
  type: localStorage.getItem("type") || "",
  token: localStorage.getItem("token") || ""
};

export default (state = INITIAL_VALUES, action) => {
  // console.log('LOGIN',action.payload)
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        type: action.payload.user?action.payload.user.job:null,
        currentUser: action.payload.user?action.payload.user.username:null
      };
    default:
      return state;
  }
};
