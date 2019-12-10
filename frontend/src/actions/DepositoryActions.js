import {  GET_PRODUCT_FIELDS } from "./types";
import server from "../apis/server";

export const getProductFields = () => async dispatch => {
    const response = await server(localStorage.getItem("token")).get("/product-fields/");
    console.log('response.GET_PRODUCT_FIELDS',response.data);
    dispatch({type: GET_PRODUCT_FIELDS, payload: response.data});
}
// export const setNewBill = (data) => async dispatch => {
//     console.log('sd',data);
//     const response = await server(localStorage.getItem("token")).post("/bills/", data).then(() => {
//         console.log('respond set New Bill: ', response);
//     });
//     dispatch({type: ADD_BILL, payload: response.data});
// }