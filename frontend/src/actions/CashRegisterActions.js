import { GET_ACTIVE_BILL } from "./types";
import { server } from "../apis/server";

export const getActiveBills = (page = 1) => async dispatch => {
  const response = await server(
    localStorage.getItem("token")
  ).get("/bills/actives/", { params: { page } });
  dispatch({ type: GET_ACTIVE_BILL, payload: response.data });
  return response;
};

export const deleteBill = pk => async () => {
  const response = await server(localStorage.getItem("token")).delete(
    `/bills/${pk}/`
  );
  return response;
};
