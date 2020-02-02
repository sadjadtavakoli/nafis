import { GET_CLASS_TYPES_AND_CITY } from "./types";
import { server } from "../apis/server";

export const getClassTypes = () => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    `/customer-fields/`
  );
  dispatch({ type: GET_CLASS_TYPES_AND_CITY, payload: response.data });
  return response;
};
