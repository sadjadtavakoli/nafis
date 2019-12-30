import axios from "axios";
import * as auth from "./auth";
export const server = (token = localStorage.getItem("token")) =>
  axios.create({
    baseURL: `${auth.PROTOCOL}://${auth.BASE}:${auth.PORT}/api`,
    headers: { Authorization: "Token " + token }
  });
export const putServer = (token = localStorage.getItem("token"),url,data) =>
  axios({
    
        method: 'patch',
        url: `${auth.PROTOCOL}://${auth.BASE}:${auth.PORT}/api${url}`,
        headers: { withCredentials: true,Authorization: "Token " + token },
        data: data,
    });


export default server;
