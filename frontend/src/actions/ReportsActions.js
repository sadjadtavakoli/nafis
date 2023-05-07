import {
  GET_INTERVAL_REPORTS,
  GET_CHARTS_REPORT,
  GET_INTERVAL_BILL_REPORT,
} from "./types";
import server from "../apis/server";

export const getIntervalBillReport = (
  page = 1,
  start_date,
  end_date
) => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    "/bills/interval-bills/",
    {
      params: {
        page,
        start_date,
        end_date,
      },
    }
  );
  dispatch({ type: GET_INTERVAL_BILL_REPORT, payload: response.data });
  return response;
};
export const getIntervalReports = (
  page = 1,
  start_date,
  end_date
) => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    "/bills/interval-report/",
    {
      params: {
        page,
        start_date,
        end_date,
      },
    }
  );
  dispatch({ type: GET_INTERVAL_REPORTS, payload: response.data });
  return response;
};

export const getChartsReport = (
  page = 1,
  start_date,
  end_date
) => async dispatch => {
  const response = await server(localStorage.getItem("token")).get(
    "/bills/charts/",
    {
      params: {
        page,
        start_date,
        end_date,
      },
    }
  );
  dispatch({ type: GET_CHARTS_REPORT, payload: response.data });
};

// export const getDateRange = () => {
//   dispatch({ type: GET_DATE_RANGE })
// }
