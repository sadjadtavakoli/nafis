// import { createSelector } from "reselect";

// const billsItemSelector = state => state.bills.bills;
// const billID = (state, props) => props.billPK;

// const billByID = createSelector([billsItemSelector, billID], (bills, billID) =>
//   bills.reduce((acc, bi) => {
//     console.log("bill.pk: ", bi.pk, "billID: ", billID, "accmolator: ", acc);
//     return bi.pk === billID ? Object.assign(acc, bi) : undefined;
//   }, {})
// );
