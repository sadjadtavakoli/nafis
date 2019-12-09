import { LOGIN } from "./types";
import * as authJS from "../apis/auth";

export const login = (username, password) => async dispatch => {
    console.log(username,password)
    const response = await authJS.auth.post("/", {username, password});
    // const response = await authJS.auth.get("/");
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", response.data.user);
    localStorage.setItem("type", response.data.type);
    dispatch({type: LOGIN, payload: response.data});
    // dispatch({ type: LOGIN, payload: response.data[0] });
};
export const logOut = () => async dispatch => {
    localStorage.removeItem('type');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    let response = {type:null,token:null,user:null}
    dispatch({type: LOGIN, payload: response});
};