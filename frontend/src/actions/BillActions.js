import * as ActionTypes from "./types";
import {
  createFetchAction,
  createSucssAction,
  createFaildAction
} from "../utils/FunctionalUtils";
// import { normalize, denormalize } from "normalizr";

export const getAllBills = () => (dispatch, getStore) => {};

export const getAllActiveBills = () => (
  dispatch,
  getStore,
  { api, schema }
) => {
  const fetch = createFetchAction(ActionTypes.GET_ACTIVE_BILL);
  const sucss = createSucssAction(ActionTypes.GET_ACTIVE_BILL);
  const faild = createFaildAction(ActionTypes.GET_ACTIVE_BILL);

  dispatch(fetch());
  return api(`/bills/actives/`)
    .then(res => res.data)
    .then(activeBills => {
      // console.log("normalize: ", normalize(activeBills, schema.billListSchema));
      dispatch(sucss(activeBills.results));
      return activeBills.results;
    })
    .catch(error => {
      dispatch(faild(error));
    });
};

export const addPaymentToBill = (billID, payment) => (
  dispatch,
  getStore,
  { api }
) => {
  const fetch = createFetchAction(ActionTypes.ADD_PAYMENT_TO_BILL);
  const sucss = createSucssAction(ActionTypes.ADD_PAYMENT_TO_BILL);
  const faild = createFaildAction(ActionTypes.ADD_PAYMENT_TO_BILL);

  dispatch(fetch());
  return api
    .post(`/bills/${billID}/add-payments/`, payment)
    .then(res => res.data)
    .then(res => {
      dispatch(sucss({ payment: res, billID }));
    });
};

export const removePayment = (billID, paymentID) => (
  dispatch,
  getStore,
  { api }
) => {
  const fetch = createFetchAction(ActionTypes.REMOVE_PAYMENT);
  const sucss = createSucssAction(ActionTypes.REMOVE_PAYMENT);
  const faild = createFaildAction(ActionTypes.REMOVE_PAYMENT);

  fetch();
  return api.delete(`/payments/${paymentID}/`).then(res => {
    console.log(res);
    if (res.status >= 200 && res.status < 300)
      dispatch(sucss({ billID, paymentID }));
  });
};

export const doneTheBill = (billID, sendSms) => (dispatch, _, { api }) => {
  const fetch = createFetchAction(ActionTypes.CHANGE_BILL_TO_DONE);
  const sucss = createSucssAction(ActionTypes.CHANGE_BILL_TO_DONE);
  const faild = createFaildAction(ActionTypes.CHANGE_BILL_TO_DONE);

  fetch();
  return api
    .post(`/bills/${billID}/done/`, { send_message: sendSms })
    .then(res => res.data)
    .then(res => {
      dispatch(sucss({ billID }));
    });
};

export const removeBill = billID => (dispatch, _, { api }) => {
  const fetch = createFetchAction(ActionTypes.REMOVE_BILL);
  const sucss = createSucssAction(ActionTypes.REMOVE_BILL);
  const faild = createFaildAction(ActionTypes.REMOVE_BILL);

  fetch();
  return api
    .delete(`/bills/${billID}/`)
    .then(res => {
      console.warn("remove", res);
      if (res.status >= 200 && res.status < 300) dispatch(sucss({ billID }));
      return res.data.detail;
    })
    .catch(err => {
      throw `نمی‌توانید فاکتوری را که پرداخت دارد حذف کنید، ابتدا پرداخت‌ها را حذف نموده سپس نسبت به حذف فاکتور اقدام نمایید.`;
    });
};

export const getBillREQUEST = billID => (dispatch, _, { api }) => {
  const fetch = createFetchAction(ActionTypes.GET_BILL);
  const sucss = createSucssAction(ActionTypes.GET_BILL);
  const faild = createFaildAction(ActionTypes.GET_BILL);

  dispatch(fetch());
  return api
    .get(`/bills/${billID}/`)
    .then(res => res.data)
    .then(res => {
      dispatch(sucss({ bill: res }));
      return res;
    });
};
