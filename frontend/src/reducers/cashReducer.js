import {
  GET_ACTIVE_BILL,
  GET_ONE_BILL,
  ADD_PAYMENT_TO_BILL
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
    default:
      return state;
  }
};
