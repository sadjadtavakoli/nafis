import * as ActionTypes from "../actions/types";
import { updateItemInArray, createReducer } from "../utils/FunctionalUtils";

const INITIAL_STATE = {
  loading: false,
  bills: [],
  dailyReport: [],
  error: undefined
};

export default createReducer(INITIAL_STATE, {
  [ActionTypes.GET_DAILY_REPORT]: (state, action) => ({
    ...state,
    dailyReport: action.payload
  }),
  [ActionTypes.FETCH(ActionTypes.GET_ACTIVE_BILL)]: (state, action) => ({
    ...state,
    loading: true
  }),
  [ActionTypes.SUCSS(ActionTypes.GET_ACTIVE_BILL)]: (state, action) => ({
    ...state,
    loading: false,
    bills: action.payload
  }),
  [ActionTypes.FAILD(ActionTypes.GET_ACTIVE_BILL)]: (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }),
  [ActionTypes.SUCSS(ActionTypes.ADD_PAYMENT_TO_BILL)]: (state, action) => ({
    ...state,
    bills: updateItemInArray(state.bills, action.payload.billID, bill => {
      return { ...bill, payments: [...bill.payments, action.payload.payment] };
    })
  }),
  [ActionTypes.SUCSS(ActionTypes.REMOVE_PAYMENT)]: (state, action) => ({
    ...state,
    bills: updateItemInArray(state.bills, action.payload.billID, bill => {
      const willRemovePayment = bill.payments.find(
        paymentItem => paymentItem.pk === action.payload.paymentID
      );
      return {
        ...bill,
        paid: Number(bill.paid) + Number(willRemovePayment.amount),
        remaining_payment:
          Number(bill.remaining_payment) + Number(willRemovePayment.amount),
        payments: bill.payments.filter(
          eachPayment => eachPayment.pk !== action.payload.paymentID
        )
      };
    })
  }),
  [ActionTypes.SUCSS(ActionTypes.CHANGE_BILL_TO_DONE)]: (state, action) => ({
    ...state,
    bills: updateItemInArray(state.bills, action.payload.billID, bill => ({
      ...bill,
      status: "done"
    }))
  }),
  [ActionTypes.SUCSS(ActionTypes.REMOVE_BILL)]: (state, action) => ({
    ...state,
    bills: state.bills.filter(bill => bill.pk !== action.payload.billID)
  }),
  [ActionTypes.SUCSS(ActionTypes.UPDATE_Bill)]: (state, action) => ({
    ...state,
    bills: updateItemInArray(
      state.bills,
      action.payload.billID,
      _ => action.payload.bill
    )
  })
});
