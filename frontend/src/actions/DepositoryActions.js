import { GET_PRODUCT_FIELDS, GET_PRODUCT_LIST, GET_PRODUCT_ID } from "./types";
import server from "../apis/server";

export const getProductsList = (page = 1) => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    "/products/",
    { params: { page } }
  );
  dispatch({ type: GET_PRODUCT_LIST, payload: response.data });
};
export const getProductsByCode = (code, page = 1) => async dispatch => {
  const response = await server(
    localStorage.getItem("token")
  ).get("/products/code/", { params: { code, page } });
  dispatch({ type: GET_PRODUCT_LIST, payload: response.data });
};
export const getProductFields = () => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    "/product-fields/"
  );
  dispatch({ type: GET_PRODUCT_FIELDS, payload: response.data });
};
export const getProductID = () => async dispatch => {
  const response = await server(localStorage.getItem("token")).post(
    "/product-id/"
  );
  dispatch({ type: GET_PRODUCT_ID, payload: response.data });
};
export const setNewProduct = data => async dispatch => {
  // const response = await server(localStorage.getItem("token")).post(
  //   "/products/",
  //   data
  // );
  // dispatch({type: ADD_BILL, payload: response.data});
};
