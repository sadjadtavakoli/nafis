import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";

import authReducer from "./authReducer";
import saleReducer from "./saleReducer";
import depositoryReducer from "./depositoryReducer";
import billReducer from "./billReducer";
import reportsReducer from "./reportsReducer";
import customers from "./customersReducer";
import suppliersReducer from "./suppliersReducer";
import cashReducer from "./cashReducer";

export default combineReducers({
  cash: cashReducer,
  auth: authReducer,
  sale: saleReducer,
  depository: depositoryReducer,
  bills: billReducer,
  toastr: toastrReducer,
  reports: reportsReducer,
  customers: customers,
  suppliers: suppliersReducer
});
