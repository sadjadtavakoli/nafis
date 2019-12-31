import { GET_INTERVAL_REPORTS, GET_CHARTS_REPORT } from "./types";
import server from "../apis/server";

export const getIntervalReports = (page=1) => async dispatch => {
    const response = await server(localStorage.getItem("token")).get("/bills/interval-report/", {
      params: {
        start_date: "2019-10-10",
        end_date: "2020-12-12"
      }
    });
    dispatch({ type: GET_INTERVAL_REPORTS, payload: response.data });
}

export const getChartsReport = (page=1) => async dispatch => {
  const response = await server(localStorage.getItem("token")).get("/bills/charts/", {
    params: {
      start_date: "2019-10-9",
      end_date: "2020-12-20"
    }
  });
  dispatch({ type: GET_CHARTS_REPORT, payload: response.data });
}