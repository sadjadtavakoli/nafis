import {
  GET_SUPPLIERS,
  GET_THE_SUPPLIER,
  ADD_SUPPLIER,
  GET_SUPPLIER_FACTORS,
  GET_SUPPLIER_FACTOR,
  ADD_SUPPLIER_FACTOR,
  GET_PRODUCT_LIST,
  ADD_FACTOR_ITEM,
  ADD_PAYMENT_TO_SUPPLIER_BILL,
} from "../actions/types";

const INITIAL_VALUES = {};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case GET_SUPPLIERS:
      return { ...state, suppliers: action.payload };
    case GET_THE_SUPPLIER:
      return { ...state, supplier: action.payload };
    case ADD_SUPPLIER:
      return { ...state, newSupplier: action.payload };
    case GET_SUPPLIER_FACTORS:
      return { ...state, factors: action.payload };
    case GET_SUPPLIER_FACTOR:
      return { ...state, factor: action.payload };
    case ADD_SUPPLIER_FACTOR:
      return { ...state, factor: action.payload };
    case GET_PRODUCT_LIST:
      return { ...state, product: action.payload };
    case ADD_FACTOR_ITEM:
      return { ...state, product: action.payload };
    case ADD_PAYMENT_TO_SUPPLIER_BILL:
      return { ...state, payment: action.payload };
    default:
      return state;
  }
};
