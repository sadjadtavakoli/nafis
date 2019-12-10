import {  GET_PRODUCT_FIELDS,GET_PRODUCT_LIST } from "./types";
import server from "../apis/server";

export const getProductsList = (page=1) => async dispatch => {
    const response = await server(localStorage.getItem("token")).get("/products/", { params:{page}});
    dispatch({type: GET_PRODUCT_LIST, payload: response.data});
}
export const getProductFields = () => async dispatch => {
    const response = await server(localStorage.getItem("token")).get("/product-fields/");
    dispatch({type: GET_PRODUCT_FIELDS, payload: response.data});
}
export const setNewProduct = (data) => async dispatch => {
    console.log('sd',data);
    const response = await server(localStorage.getItem("token")).post("/products/", data)
    // dispatch({type: ADD_BILL, payload: response.data});
}