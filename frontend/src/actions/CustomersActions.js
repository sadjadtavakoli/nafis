import { putServer, server } from '../apis/server'
import {
  ADD_CUSTOMER,
  GET_ALL_BILLS,
  GET_ALL_CHEQUES,
  GET_A_CUSTOMER,
  GET_CLASS_TYPES_AND_CITY,
  GET_REMAINED_BILLS,
  GET_REMAINED_CHEQUES,
  GET_USERS_CUSTOMERS,
} from './types'

export const getCustomerUsers =
  (page = 1) =>
  async (dispatch) => {
    const response = await server(localStorage.getItem('token')).get(
      '/customers/',
      {
        params: { page },
      }
    )
    dispatch({ type: GET_USERS_CUSTOMERS, payload: response.data })
    return response
  }

export const getCustomerBySearch = (query) => async (dispatch) => {
  const response = await server(localStorage.getItem('token')).get(
    '/customers/search/',
    {
      params: { query },
    }
  )
  dispatch({ type: GET_USERS_CUSTOMERS, payload: response.data })
  return response
}

export const getAllBills =
  (pk, page = 1) =>
  async (dispatch) => {
    const response = await server(localStorage.getItem('token')).get(
      `/customers/${pk}/bills/`,
      { params: { page } }
    )
    dispatch({ type: GET_ALL_BILLS, payload: response.data })
    return response
  }

export const getAllCheques = (pk) => async (dispatch) => {
  const response = await server(localStorage.getItem('token')).get(
    `/customers/${pk}/cheques/`
  )
  dispatch({ type: GET_ALL_CHEQUES, payload: response.data })
  return response
}

export const getACustomer = (pk) => async (dispatch) => {
  const response = await server(localStorage.getItem('token')).get(
    `/customers/${pk}/`
  )
  dispatch({ type: GET_A_CUSTOMER, payload: response.data })
  return response.data
}

export const deleteCustomer = (pk) => async () => {
  const response = await server(localStorage.getItem('token')).delete(
    `/customers/${pk}/`
  )
  return response
}

export const updateCustomer = (pk, data) => async () => {
  return await putServer(
    localStorage.getItem('token'),
    `/customers/${pk}/`,
    data
  )
}

export const getRemainedBills = (pk) => async (dispatch) => {
  const response = await server(localStorage.getItem('token')).get(
    `/customers/${pk}/remained-bills/`
  )
  dispatch({ type: GET_REMAINED_BILLS, payload: response.data })
  return response
}

export const getRemainedCheques = (pk) => async (dispatch) => {
  const response = await server(localStorage.getItem('token')).get(
    `/customers/${pk}/remained-cheques/`
  )
  dispatch({ type: GET_REMAINED_CHEQUES, payload: response.data })
  return response
}

export const getClassTypes = () => async (dispatch) => {
  const response = await server(localStorage.getItem('token')).get(
    `/customer-fields/`
  )
  dispatch({ type: GET_CLASS_TYPES_AND_CITY, payload: response.data })
  return response
}

export const setNewCustomer = (data) => async (dispatch) => {
  const response = await server(localStorage.getItem('token')).post(
    '/customers/',
    data
  )
  dispatch({ type: ADD_CUSTOMER, payload: response.data })
}
