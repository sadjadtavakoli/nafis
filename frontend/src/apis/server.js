import axios from "axios";
import * as auth from "./auth";
export const server = (token = localStorage.getItem("token")) =>
  axios.create({
    baseURL: `${auth.PROTOCOL}://${auth.BASE}:${auth.PORT}/api`,
    headers: { Authorization: "Token " + token }
  });

export default server;
