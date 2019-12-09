import {  GET_ACTIVE_BILL,ADD_BILL } from "./types";
import server from "../apis/server";

export const getActiveBill = () => async dispatch => {
    const response = await server(localStorage.getItem("token")).get("/bills/actives/");
    console.log('response.data',response.data);
    dispatch({type: GET_ACTIVE_BILL, payload: response.data});
}
export const setNewBill = (data) => async dispatch => {
    console.log('sd',data);
    const response = await server(localStorage.getItem("token")).post("/bills/", data).then(() => {
        console.log('respond set New Bill: ', response);
    });
    dispatch({type: ADD_BILL, payload: response.data});

}