import { GET_ACTIVE_BILL, ADD_BILL } from "../actions/types";

const INITIAL_VALUES = {};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case GET_ACTIVE_BILL:
      return { ...state, activeBill: action.payload };
    case ADD_BILL:
      return { ...state, newBillData: action.payload };
    default:
      return state;
  }
};
