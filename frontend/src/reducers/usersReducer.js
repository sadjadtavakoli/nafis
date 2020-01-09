import {
  GET_USERS_CUSTOMERS,
  GET_ALL_BILLS,
  GET_A_CUSTOMER
} from "../actions/types";

const INITIAL_VALUES = {};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case GET_USERS_CUSTOMERS:
      return { ...state, usersCustomers: action.payload };
    case GET_ALL_BILLS:
      return { ...state, allBills: action.payload };
    case GET_A_CUSTOMER:
      return { ...state, theCustomer: action.payload };
    default:
      return state;
  }
};
