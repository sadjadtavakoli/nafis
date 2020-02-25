import { LOGIN } from "./types";
import * as authJS from "../apis/auth";

export const login = (username, password) => async dispatch => {
  const response = await authJS.auth.post("/", { username, password });
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  localStorage.setItem("type", response.data.user.job);
  dispatch({ type: LOGIN, payload: response.data });
};
export const logOut = () => async dispatch => {
  localStorage.removeItem("type");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  let response = { type: null, token: null, user: null };
  dispatch({ type: LOGIN, payload: response });
};
