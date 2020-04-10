import {
  GET_INTERVAL_REPORTS,
  GET_CHARTS_REPORT,
  UPDATE_BILL_ITEM,
  GET_INTERVAL_BILL_REPORT,
} from "../actions/types";

const INITIAL_VALUES = {};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case GET_INTERVAL_REPORTS:
      return { ...state, intervalReports: action.payload };
    case GET_CHARTS_REPORT:
      return { ...state, chartsReport: action.payload };
    case UPDATE_BILL_ITEM:
      return { ...state, updatedBill: action.payload };
    case GET_INTERVAL_BILL_REPORT:
      return { ...state, intervalBillReport: action.payload };
    default:
      return state;
  }
};
