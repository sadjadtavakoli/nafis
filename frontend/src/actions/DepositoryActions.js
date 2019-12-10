import {  GET_PRODUCT_FIELDS,GET_PRODUCT_LIST } from "./types";
import server from "../apis/server";

export const getProductsList = () => async dispatch => {
    const response = await server(localStorage.getItem("token")).get("/products/");
    dispatch({type: GET_PRODUCT_LIST, payload: response.data});
}
export const getProductFields = () => async dispatch => {
    const response = await server(localStorage.getItem("token")).get("/product-fields/");
    dispatch({type: GET_PRODUCT_FIELDS, payload: response.data});
}
export const setNewProduct = (data) => async dispatch => {
    console.log('sd',data);
    const response = await server(localStorage.getItem("token")).post("/products/", data).then(() => {
        console.log('respond set New Product: ', response);
    });
    // dispatch({type: ADD_BILL, payload: response.data});
}