import { toastr } from 'react-redux-toastr'
import server, { putServer } from '../apis/server'
import { ADD_BILL, GET_ACTIVE_BILL } from './types'

export const getActiveBill =
  (page = 1) =>
  async (dispatch) => {
    const response = await server(localStorage.getItem('token')).get(
      '/bills/actives/',
      { params: { page } }
    )
    dispatch({ type: GET_ACTIVE_BILL, payload: response.data })
  }

export const getCustomerByPhoneNumber = (phone_number) => async () => {
  return await server(localStorage.getItem('token')).get('/customers/phone/', {
    params: { phone_number },
  })
}

export const setNewBill = (data) => async (dispatch) => {
  const response = await server(localStorage.getItem('token')).post(
    '/bills/',
    data
  )
  dispatch({ type: ADD_BILL, payload: response.data })
}

export const updateBill = (pk, data) => async () => {
  return await putServer(localStorage.getItem('token'), `/bills/${pk}/`, data)
}

export const addNewItem = (data) => async () => {
  return await server(localStorage.getItem('token')).post(`/bill-items/`, data)
}

export const updateBillItem = (pk, data) => async () => {
  const response = await server(localStorage.getItem('token'))
    .patch(`/bill-items/${pk}/`, data)
    .catch((_err) => {
      toastr.error(_err?.response?.statusText, _err?.response?.data?.detail)
    })
  return response
}

export const deleteItem = (pk) => async () => {
  const response = await server(localStorage.getItem('token')).delete(
    `/bill-items/${pk}/`
  )
  return response
}
