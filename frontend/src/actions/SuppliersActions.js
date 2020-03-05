import {
  GET_SUPPLIERS,
  GET_THE_SUPPLIER,
  ADD_SUPPLIER,
  GET_SUPPLIER_FACTORS,
  GET_SUPPLIER_FACTOR,
  DELETE_SUPPLIER_FACTOR,
  ADD_SUPPLIER_FACTOR,
  GET_PRODUCT_LIST
} from "./types";
import { server, putServer } from "../apis/server";

export const getSuppliersAction = (page = 1) => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    `/suppliers/`,
    {
      params: { page }
    }
  );
  dispatch({ type: GET_SUPPLIERS, payload: response.data });
  return response;
};

export const setNewSupplier = data => async dispatch => {
  const response = await server(localStorage.getItem("token")).post(
    "/suppliers/",
    data
  );
  dispatch({ type: ADD_SUPPLIER, payload: response.data });
};

export const getTheSupplier = pk => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    `/suppliers/${pk}/`
  );
  dispatch({ type: GET_THE_SUPPLIER, payload: response.data });
  return response;
};

export const updateSupplier = (pk, data) => async () => {
  return await putServer(
    localStorage.getItem("token"),
    `/suppliers/${pk}/`,
    data
  );
};

export const getSupplierBySearch = query => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    "/suppliers/search/",
    {
      params: { query }
    }
  );
  dispatch({ type: GET_SUPPLIERS, payload: response.data });
  return response;
};

export const getSupplierFactors = pk => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    `/suppliers/${pk}/bills/`
  );
  dispatch({ type: GET_SUPPLIER_FACTORS, payload: response.data });
  return response;
};

export const deleteSupplierFactor = pk => async dispatch => {
  const response = await server(localStorage.getItem("token")).delete(
    `/supplier-bills/${pk}/`
  );
  dispatch({ type: DELETE_SUPPLIER_FACTOR, payload: response.data });
  return response;
};

export const getSupplierFactor = pk => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    `/supplier-bills/${pk}/`
  );
  dispatch({ type: GET_SUPPLIER_FACTOR, payload: response.data });
  return response;
};

export const deleteFactorItem = pk => async () => {
  const response = await server(localStorage.getItem("token")).delete(
    `/supplier-bill-items/${pk}/`
  );
  return response;
};

export const addSupplierFactor = (pk, data) => async dispatch => {
  const response = await server(localStorage.getItem("token")).post(
    `/suppliers/${pk}/add-bill/`,
    data
  );
  dispatch({ type: ADD_SUPPLIER_FACTOR, payload: response.data });
  return response;
};

export const getProductsByCode = (code, page = 1) => async dispatch => {
  const response = await server(
    localStorage.getItem("token")
  ).get("/products/code/", { params: { code, page } });
  dispatch({ type: GET_PRODUCT_LIST, payload: response.data });
};
