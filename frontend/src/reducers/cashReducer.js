import {
  GET_ACTIVE_BILL,
  GET_ONE_BILL,
  ADD_PAYMENT_TO_BILL,
  GET_DAILY_REPORT
} from "../actions/types";

const INITIAL_VALUES = {};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case GET_ACTIVE_BILL:
      return { ...state, activeBills: action.payload };
    case GET_ONE_BILL:
      return { ...state, theBill: action.payload };
    case ADD_PAYMENT_TO_BILL:
      return { ...state, payment: action.payload };
    case GET_DAILY_REPORT:
      return { ...state, dailyReport: action.payload };
    default:
      return state;
  }
};
