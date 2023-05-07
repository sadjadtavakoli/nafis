import { GET_ACTIVE_BILL, ADD_BILL, GET_ONE_BILL } from "../actions/types";

const INITIAL_VALUES = {};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case GET_ACTIVE_BILL:
      return { ...state, activeBill: action.payload };
    case ADD_BILL:
      return { ...state, newBillData: action.payload };
    case GET_ONE_BILL:
      return { ...state, theBill: action.payload };
    default:
      return state;
  }
};
