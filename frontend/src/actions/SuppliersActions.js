import { GET_SUPPLIERS } from "./types";
import { server } from "../apis/server";

export const getSuppliersAction = (page = 1) => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    "/suppliers/",
    {
      // params: { page }
    }
  );
  dispatch({ type: GET_SUPPLIERS, payload: response.data });
  return response;
};
