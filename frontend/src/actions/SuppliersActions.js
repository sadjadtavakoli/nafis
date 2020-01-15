import { GET_SUPPLIERS } from "./types";
import { server } from "../apis/server";

export const getSuppliersAction = pk => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    `/suppliers/${pk}/`
  );
  dispatch({ type: GET_SUPPLIERS, payload: response.data });
};
