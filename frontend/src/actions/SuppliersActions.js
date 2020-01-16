import { GET_SUPPLIERS, GET_THE_SUPPLIER } from "./types";
import { server, putServer } from "../apis/server";

export const getSuppliersAction = (page = 1) => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    `/suppliers/`,
    {
      params: { page }
    }
  );
  dispatch({ type: GET_SUPPLIERS, payload: response.data });
  return response;
};

export const getTheSupplier = pk => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    `/suppliers/${pk}/`
  );
  dispatch({ type: GET_THE_SUPPLIER, payload: response.data });
  return response;
};

export const updateSupplier = (pk, data) => async dispatch => {
  return await putServer(
    localStorage.getItem("token"),
    `/suppliers/${pk}/`,
    data
  );
};
