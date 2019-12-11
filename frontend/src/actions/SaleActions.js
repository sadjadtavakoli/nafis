import {  GET_ACTIVE_BILL,ADD_BILL } from "./types";
import server from "../apis/server";

export const getActiveBill = (page=1) => async dispatch => {
    const response = await server(localStorage.getItem("token")).get("/bills/actives/", {params:{page}});
    dispatch({ type: GET_ACTIVE_BILL, payload: response.data });
}
export const setNewBill = (data) => async dispatch => {
    const response = await server(localStorage.getItem("token")).post("/bills/", data)
    dispatch({type: ADD_BILL, payload: response.data});
}
export const addNewItem = (pk,data) => async dispatch => {
    return await server(localStorage.getItem("token")).post(`/bill-items/`, data)
}
