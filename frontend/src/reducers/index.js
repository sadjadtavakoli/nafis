import { combineReducers } from "redux";

// import receiptReducer from "./receiptReducer";
// import receiptsReducer from "./receiptsReducer";
// import { reducer as formReducer } from "redux-form";
// import customersReducer from "./customersReducer";
// import productsReducer from './productsReducer';
// import providerReducer from './providerReducer'
import authReducer from './authReducer';
import saleReducer from './saleReducer';
// import billReportsReducer from './billReportsReducer';
// import chartsReportsReducer from './chartsReportsReducer';
// import notificationsReducer from './notificationsReducer';
// import reportReducer from "./reportReducer";
import {reducer as toastrReducer} from 'react-redux-toastr'
// import billByPhoneNumberReducer from "./billByPhoneNumberReducer";
// import navBarDisplayReducer from "./navBarDisplayReducer";
// import printDataReducer from "./printDataReducer";

export default combineReducers({
  // receipt: receiptReducer,
  // form: formReducer,
  // customers: customersReducer,
  // receipts: receiptsReducer,
  // products: productsReducer,
  // providers: providerReducer,
  auth: authReducer,
  activeBill: saleReducer,
  // billReports: billReportsReducer,
  // billByPhoneNumber: billByPhoneNumberReducer,
  // charts: chartsReportsReducer,
  // notifications: notificationsReducer,
  // reports: reportReducer,
  toastr: toastrReducer,
  // navBar: navBarDisplayReducer,
  // print: printDataReducer,
});
