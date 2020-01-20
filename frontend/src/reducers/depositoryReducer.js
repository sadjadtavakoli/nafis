import {
  GET_PRODUCT_FIELDS,
  GET_PRODUCT_LIST,
  GET_PRODUCT_ID,
  GET_PRODUCT_PROFILE
} from "../actions/types";

const INITIAL_VALUES = {};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case GET_PRODUCT_FIELDS:
      return { ...state, productFields: action.payload };
    case GET_PRODUCT_LIST:
      return { ...state, productsList: action.payload };
    case GET_PRODUCT_ID:
      return { ...state, productID: action.payload };
    default:
      return state;
  }
};
