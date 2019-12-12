import * as ActionTypes from "../actions/types";
import {
  updateObject,
  updateItemInArray,
  createReducer
} from "../utils/FunctionalUtils";

// const addBill = (billsState, action) => {
//   return billsState.bills.concat({ [action.payload.pk]: action.payload });
// };

// const editBill = (billsState, action) =>
//   updateItemInArray(billsState, action.payload.id, bill =>
//     updateObject(bill, action.payload.target)
//   );

const INITIAL_STATE = {
  loading: false,
  bills: [],
  error: undefined
};

export default createReducer(INITIAL_STATE, {
  //   ADD_Bill: addBill,
  //   EDIT_Bill: editBill,
  [ActionTypes.FETCH(ActionTypes.GET_ACTIVE_BILL)]: (state, action) => ({
    ...state,
    loading: true
  }),
  [ActionTypes.SUCSS(ActionTypes.GET_ACTIVE_BILL)]: (state, action) => ({
    ...state,
    loading: false,
    bills: action.payload
  }),
  [ActionTypes.FAILD(ActionTypes.GET_ACTIVE_BILL)]: (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }),
  [ActionTypes.SUCSS(ActionTypes.ADD_PAYMENT_TO_BILL)]: (state, action) => ({
    ...state,
    bills: updateItemInArray(state.bills, action.payload.billID, bill => {
      return { ...bill, payments: [...bill.payments, action.payload.payment] };
    })
  }),
  [ActionTypes.SUCSS(ActionTypes.REMOVE_PAYMENT)]: (state, action) => ({
    ...state,
    bills: updateItemInArray(state.bills, action.payload.billID, bill => ({
      ...bill,
      payments: bill.payments.filter(
        eachPayment => eachPayment.pk !== action.payload.paymentID
      )
    }))
  }),
  [ActionTypes.SUCSS(ActionTypes.CHANGE_BILL_TO_DONE)]: (state, action) => ({
    ...state,
    bills: updateItemInArray(state.bills, action.payload.billID, bill => ({
      ...bill,
      status: "done"
    }))
  }),
  [ActionTypes.SUCSS(ActionTypes.REMOVE_BILL)]: (state, action) => ({
    ...state,
    bills: state.bills.filter(bill => bill.pk !== action.payload.billID)
  })
});

// export default (state = INITIAL_STATE, action) => {
//   switch (action.type) {
//     case ActionTypes.FETCH(ActionTypes.GET_ACTIVE_BILL): {
//       return { ...state, loading: true };
//       break;
//     }
//     case ActionTypes.SUCSS(ActionTypes.GET_ACTIVE_BILL): {
//       return { ...state, loading: false };
//       break;
//     }
//     case ActionTypes.FAILD(ActionTypes.GET_ACTIVE_BILL): {
//       return { ...state, loading: false, error: action.error };
//       break;
//     }
//     default:
//       return state;
//   }
// };
