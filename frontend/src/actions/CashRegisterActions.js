import { GET_ACTIVE_BILL, GET_ONE_BILL, ADD_PAYMENT_TO_BILL } from "./types";
import { server } from "../apis/server";

export const getActiveBills = (page = 1) => async dispatch => {
  const response = await server(
    localStorage.getItem("token")
  ).get("/bills/actives/", { params: { page } });
  dispatch({ type: GET_ACTIVE_BILL, payload: response.data });
  return response;
};

export const deleteBill = pk => async () => {
  const response = await server(localStorage.getItem("token")).delete(
    `/bills/${pk}/`
  );
  return response;
};

export const getOneBill = pk => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    `/bills/${pk}/`
  );
  dispatch({ type: GET_ONE_BILL, payload: response.data });
  return response;
};

export const addPaymentToBill = (billID, data) => async dispatch => {
  const response = await server(localStorage.getItem("token")).post(
    `/bills/${billID}/add-payments/`,
    data
  );
  dispatch({ type: ADD_PAYMENT_TO_BILL, payload: response.data });
  return response;
};

export const deletePayment = paymentID => async () => {
  const response = await server(localStorage.getItem("token")).delete(
    `/payments/${paymentID}/`
  );
  return response;
};

export const doneTheBill = (billID, sendSms) => async () => {
  const response = await server(
    localStorage.getItem("token")
  ).post(`/bills/${billID}/done/`, { send_message: sendSms });
  return response;
};
