import {
    INIT_RECEIPT,
    FETCH_CUSTOMERS,
    ADD_CUSTOMER,
    GET_CUSTOMER_CODE,
    FETCH_CUSTOMER,
    DELETE_CUSTOMER,
    FETCH_RECEIPTS,
    NAV_BAR_DISPLAY,
    PRINT_DATA,
    FETCH_PRODUCTS,
    FETCH_PRODUCT,
    ADD_PRODUCT,
    DELETE_PRODUCT,
    EDIT_PRODUCT,
    FETCH_PROVIDER,
    FETCH_PROVIDERS,
    ADD_PROVIDER,
    EDIT_PROVIDER,
    DELETE_PROVIDER,
    UPDATE_CUSTOMER,
    FETCH_RECEIPT,
    EDIT_RECEIPT,
    DELETE_RECEIPT,
    GET_NEXT_RECEIPT,
    FETCH_RECEIPT_ENTRY,
    ADD_RECEIPT_ENTRY,
    DELETE_RECEIPT_ENTRY,
    EDIT_RECEIPT_ENTRY,
    LOGIN,
    SEARCH_CUSTOMER,
    SEARCH_PRODUCT,
    SEARCH_PROVIDER,
    SEARCH_RECEIPT,
    UPDATE_LAST_ENTRY,
    FETCH_STATS,
    // ADD_BILL,
    // ADD_BILL_RECEIPT_ENTRY,
    FETCH_CUSTOMER_RECEIPTS,
    FETCH_NOTIFICATIONS,
    SEARCH_BILL,
    NEXT_PRODUCT_CODE,
    FETCH_REPORTS,
    FETCH_CHARTS_REPORTS,
    FETCH_BILL_REPORTS,
    FETCH_BILL_BY_PHONE_NUMBER
} from "./types";
import server from "../apis/server";
import * as authJS from "../apis/auth";
import {toastr} from 'react-redux-toastr'


// export const login = (username, password) => async dispatch => {
//     const response = await authJS.auth.post("/", {username, password});
//     // const response = await authJS.auth.get("/");
//     localStorage.setItem("token", response.data.token);
//     localStorage.setItem("user", response.data.user);
//     localStorage.setItem("type", response.data.type);
//     dispatch({type: LOGIN, payload: response.data});
//     // dispatch({ type: LOGIN, payload: response.data[0] });
// };

// export const initReceipt = data => async dispatch => {
//     await server(localStorage.getItem("token"))
//         .post("/customers/", {phone_number: data.customer})
//         .catch(err => console.log(err));
//     const response = await server(localStorage.getItem("token")).post(
//         "/receipts/",
//         data
//     );
//     dispatch({type: GET_NEXT_RECEIPT, payload: response.data.id});
//     dispatch({type: INIT_RECEIPT, payload: response.data});
// };

// export const initReceiptForProvider = data => async dispatch => {
//     console.log(data);
//     const response = await server(localStorage.getItem("token")).post(
//         "/receipts/",
//         data
//     );
//     console.log(response.data);
//     dispatch({type: GET_NEXT_RECEIPT, payload: response.data.id});
//     dispatch({type: INIT_RECEIPT, payload: response.data});
// }

// export const printData = (data) => async dispatch => {
//     dispatch({type: PRINT_DATA, payload: data});
// };
// export const navBarDisplay = (display) => async dispatch => {
//     dispatch({type: NAV_BAR_DISPLAY, payload: display});
// };
// export const fetchReceipts = () => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get(
//         "/receipts/"
//     );
//     dispatch({type: FETCH_RECEIPTS, payload: response.data});
// };

// export const fetchCustomerReceipts = customerId => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get(
//         `/customer_receipts/?customer=${customerId}`
//     );
//     dispatch({type: FETCH_CUSTOMER_RECEIPTS, payload: response.data});
// };

// export const fetchReceipt = receiptId => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get(
//         `/receipts/${receiptId}`
//     );
//     dispatch({type: FETCH_RECEIPT, payload: response.data});
// };

// export const deleteReceipt = receiptId => async dispatch => {
//     await server(localStorage.getItem("token")).delete(`/receipts/${receiptId}`);
//     dispatch({type: DELETE_RECEIPT, payload: receiptId});
// };

// export const updateReceipt = (id, receiptData) => async dispatch => {
//     const response = await server(localStorage.getItem('token')).patch(`/receipts/${id}/`, receiptData);
//     dispatch({type: EDIT_RECEIPT, payload: response.data});
// };

// export const fetchCustomers = () => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get(
//         "/customers/"
//     );
//     dispatch({type: FETCH_CUSTOMERS, payload: response.data});
// };

// export const fetchCustomer = customerId => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get(
//         `/customers/${customerId}`
//     );
//     dispatch({type: FETCH_CUSTOMER, payload: response.data});
// };

// export const addCustomer = userData => async dispatch => {
//     const response = await server(localStorage.getItem("token")).post(
//         "/customers/",
//         userData
//     );
//     dispatch({type: ADD_CUSTOMER, payload: response.data});
// };

// export const fetchNextCustomerCode = () => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get(
//         "/nextCustomerCode/"
//     );
//     dispatch({type: GET_CUSTOMER_CODE, payload: response.data});
// };

// export const deleteCustomer = customerId => async dispatch => {
//     await server(localStorage.getItem("token")).delete(
//         `/customers/${customerId}`
//     );
//     dispatch({type: DELETE_CUSTOMER, payload: customerId});
// };

// export const updateCustomer = (id, customerData) => async dispatch => {
//     const response = await server(localStorage.getItem("token")).patch(
//         `/customers/${id}/`,
//         customerData
//     );
//     dispatch({type: UPDATE_CUSTOMER, payload: response.data});
// };

// export const fetchProducts = () => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get(
//         "/products/"
//     );
//     dispatch({type: FETCH_PRODUCTS, payload: response.data});
// };

// export const fetchProduct = productId => async dispatch => {
//     const response = await server(localStorage.getItem("token"))
//         .get(`/products/${productId}`)
//         .catch(() => {
//             alert("جنس مورد نظر در انبار موجود نمیباشد");
//         });
//     dispatch({type: FETCH_PRODUCT, payload: response.data});
// };

// export const addProduct = productData => async dispatch => {
//     const response = await server(localStorage.getItem("token")).post(
//         "/products/",
//         productData
//     );
//     dispatch({type: ADD_PRODUCT, payload: response.data});
// };

// export const deleteProduct = productId => async dispatch => {
//     await server(localStorage.getItem("token")).delete(`/products/${productId}`);
//     dispatch({type: DELETE_PRODUCT, payload: productId});
// };

// export const updateProduct = (id, productData) => async dispatch => {
//     const response = await server(localStorage.getItem("token")).patch(
//         `/products/${id}/`,
//         productData
//     );
//     dispatch({type: EDIT_PRODUCT, payload: response.data});
// };

//suppliers

// export const fetchProviders = () => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get(
//         "/suppliers/"
//     );
//     dispatch({type: FETCH_PROVIDERS, payload: response.data});
// };

// export const fetchProvider = providersId => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get(
//         `/suppliers/${providersId}`
//     );
//     dispatch({type: FETCH_PROVIDER, payload: response.data});
// };

// export const addProvider = providersData => async dispatch => {
//     const response = await server(localStorage.getItem("token")).post(
//         "/suppliers/",
//         providersData
//     );
//     dispatch({type: ADD_PROVIDER, payload: response.data});
// };

// export const deleteProvider = providersId => async dispatch => {
//     await server(localStorage.getItem("token")).delete(
//         `/suppliers/${providersId}`
//     );
//     dispatch({type: DELETE_PROVIDER, payload: providersId});
// };

// export const updateProvider = (id, providersData) => async dispatch => {
//     const response = await server(localStorage.getItem("token")).patch(
//         `/suppliers/${id}/`,
//         providersData
//     );
//     dispatch({type: EDIT_PROVIDER, payload: response.data});
// };

// export const addProductToReceipt = (
//     receiptId,
//     receiptEntryData,
//     items
// ) => async dispatch => {
//     receiptEntryData['product_id'] = receiptEntryData.code;
//     const entryResponse = await server(localStorage.getItem("token")).post(
//         "/receipt_entries/",
//         receiptEntryData
//     ).catch(() => {
//         toastr.error('خطا در متراژ','متراژ بیش از مقدار موجود بوده است')
//     });
//     let items_id = [];
//     items.forEach(function (item_) {
//         items_id.push(item_.pk)
//     });
//     dispatch({type: ADD_RECEIPT_ENTRY, payload: entryResponse.data});
//     const receiptResponse = await server(localStorage.getItem("token")).patch(
//         `/receipts/${receiptId}/`,
//         {
//             items: [...items_id, entryResponse.data.pk]
//         }
//     );
//     dispatch({type: EDIT_RECEIPT, payload: receiptResponse.data});
//     dispatch(updateLastEntry(entryResponse.data.id));
// };

// export const addDiscount = (receiptId, discount) => async dispatch => {
//     const response = await server(localStorage.getItem("token")).patch(
//         `/receipts/${receiptId}/`,
//         {
//             discount: discount
//         }
//     );
// };

// export const deleteProductFromReceipt = (
//     receiptId,
//     receiptEntryId,
// ) => async dispatch => {
//     await server(localStorage.getItem("token")).delete(
//         `/receipt_entries/${receiptEntryId}`
//     );
//     dispatch({type: DELETE_RECEIPT_ENTRY, payload: receiptEntryId});
// };

// export const fetchReceiptEntry = receiptEntryId => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get(
//         `/receipt_entries/${receiptEntryId}`
//     );
//     dispatch({type: FETCH_RECEIPT_ENTRY, payload: response.data});
// };

// export const addReceiptEntry = receiptEntryData => async dispatch => {
//     const response = await server(localStorage.getItem("token")).post(
//         "/receipt_entries/",
//         receiptEntryData
//     );
//     dispatch({type: ADD_RECEIPT_ENTRY, payload: response.data});
// };

// export const deleteReceiptEntry = receiptEntryId => async dispatch => {
//     await server(localStorage.getItem("token")).delete(
//         `/receipt_entries/${receiptEntryId}`
//     );
//     dispatch({type: DELETE_RECEIPT_ENTRY, payload: receiptEntryId});
// };

// export const updateReceiptEntry = (id, receiptEntryData) => async dispatch => {
//     const response = await server(localStorage.getItem("token")).patch(
//         `/receipt_entries/${id}/`,
//         receiptEntryData
//     );
//     dispatch({type: EDIT_RECEIPT_ENTRY, payload: response.data});
// };

// export const searchProduct = (query, search) => async dispatch => {
//     let response;
//     if (search) {
//         response = await server(localStorage.getItem("token")).get(
//             `/products/?${query.query}=${search}`
//         );
//     } else {
//         response = await server(localStorage.getItem("token")).get(`/products/`);
//     }
//     dispatch({type: SEARCH_PRODUCT, payload: response.data});
// };

// export const searchCustomer = (query, search) => async dispatch => {
//     let response;
//     if (search) {
//         response = await server(localStorage.getItem("token")).get(
//             `/customers/?${query.query}=${search}`
//         );
//     } else {
//         response = await server(localStorage.getItem("token")).get(`/customers/`);
//     }
//     dispatch({type: SEARCH_CUSTOMER, payload: response.data});
// };

// export const searchProvider = (query, search) => async dispatch => {
//     let response;
//     if (search) {
//         response = await server(localStorage.getItem("token")).get(
//             `/suppliers/?${query.query}=${search}`
//         );
//     } else {
//         response = await server(localStorage.getItem("token")).get(`/suppliers/`);
//     }
//     dispatch({type: SEARCH_PROVIDER, payload: response.data});
// };

// export const searchBill = (query, search) => async dispatch => {
//     let response;
//     if (search) {
//         response = await server(localStorage.getItem("token")).get(
//             `/bills/?${query.query}=${search}`
//         );
//     } else {
//         response = await server(localStorage.getItem("token")).get(`/bills/`);
//     }
//     dispatch({type: SEARCH_BILL, payload: response.data});
// };

// export const searchReceipt = (query, search) => async dispatch => {
//     let response;
//     if (search) {
//         response = await server(localStorage.getItem("token")).get(
//             `/receipts/?${query.query}=${search}`
//         );
//     } else {
//         response = await server(localStorage.getItem("token")).get(`/receipts/`);
//     }
//     dispatch({type: SEARCH_RECEIPT, payload: response.data});
// };

// // export const addBill = (data) => async dispatch => {
// //     const response = await server(localStorage.getItem("token")).post(
// //         "/add-bill/",
// //         data
// //     );
// //     dispatch({type: ADD_BILL, payload: response});
// // };

// export const addBillReceiptEntry = data => async dispatch => {
//     const response = await server(localStorage.getItem("token")).post(
//         "/sales/",
//         data
//     );
// };

// export const updateLastEntry = Id => {
//     return {type: UPDATE_LAST_ENTRY, payload: Id};
// };

// export const fetchStats = () => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get("/"); //TODO set the endpoint
//     dispatch({type: FETCH_STATS, payload: response.data});
// };

// export const fetchSalesReports = (start_date, end_date) => async dispatch => {
//     const JDate = require('jalali-date');
//     const jdate = new JDate;
//     const response = await server(localStorage.getItem("token")).post("/sales_reports/", {
//         "start_date": start_date ? start_date : jdate.format("YYYY-MM-DD"),
//         "end_date": end_date ? end_date : jdate.format("YYYY-MM-DD")
//     });
//     // const receipt_ids = response.data.sales ? response.data.sales.map((e, index) => e.receipt) :[];
// 	const receipt_ids = response.data.sales ? response.data.sales.map((e, index) => e.receipt) :[];
//     const receipt_response = await server(localStorage.getItem("token")).get(`/report_receipts/?sales=${receipt_ids}`);
//     dispatch({type: FETCH_REPORTS, payload: response.data});
//     dispatch({type: SEARCH_RECEIPT, payload: receipt_response.data});
// }
// export const fetchBillByPhoneNumber = (phone_number, page = 1,isUnpaid) => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get(`/sales/${isUnpaid?'unpaid/':''}`,{params: {phone_number,page}});
//     dispatch({ type: FETCH_BILL_BY_PHONE_NUMBER, payload: response.data });
// };
// export const fetchBillReports = (start_date,end_date,page) => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get("/sales/interval/",{params: {start_date,end_date,page}});
//     dispatch({ type: FETCH_BILL_REPORTS, payload: response.data });
// };
// export const fetchChartsReports = () => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get("/charts");
//     dispatch({ type: FETCH_CHARTS_REPORTS, payload: response.data });
// };
// export const fetchReports = (start_date,end_date) => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get("/reports",{params: {start_date,end_date}});
//     dispatch({ type: FETCH_REPORTS, payload: response.data });
// };
// export const fetchNotifications = () => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get("/notifications");
//     dispatch({type: FETCH_NOTIFICATIONS, payload: response.data});
// }

// export const getNextProductCode = () => async dispatch => {
//     const response = await server(localStorage.getItem("token")).get("/npid/");
//     dispatch({type: NEXT_PRODUCT_CODE, payload: response.data});
// }