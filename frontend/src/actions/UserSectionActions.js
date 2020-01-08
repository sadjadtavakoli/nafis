import { GET_USERS_CUSTOMERS, GET_ALL_BILLS } from "./types";
import server from "../apis/server";

export const getCustomerUsers = (page = 1) => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    "/customers/",
    {
      params: { page }
    }
  );
  dispatch({ type: GET_USERS_CUSTOMERS, payload: response.data });
};

export const getAllBills = pk => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    `/customers/${pk}/remained-bills/`
  );
  console.log(response);
  dispatch({ type: GET_ALL_BILLS, payload: response.data });
};