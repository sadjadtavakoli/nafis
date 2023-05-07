import React, { Component } from "react";
import { Table, Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import { getIntervalReports } from "../../actions/ReportsActions";
import {
  getTodayGregorian,
  toGregorian,
  getTodayJalaali,
} from "../utils/jalaaliUtils";
import LoadingBar from "../utils/loadingBar";
import NotFound from "../utils/notFound";
import { digitToComma } from "../utils/numberUtils";
import DateRange from "./DateRange";
class GeneralStatistics extends Component {
  state = { intervalReports: [], fetch: false };
  componentDidMount() {
    this.setState({
      intervalReports: this.props.intervalReports,
    });
  }
  componentWillReceiveProps(newProps, newState) {
    this.setState({
      intervalReports: newProps.intervalReports,
      fetch: newProps.fetch,
    });
  }
  fetchHandler = status => {
    this.setState({
      fetch: status,
    });
  };
  render() {
    return (
      <React.Fragment>
        <DateRange
          fetchHandler={this.fetchHandler}
          pageName={"GeneralStatistics"}
        />
        {this.state.fetch ? (
          <Table celled className="rtl text-center yekan">
            <Table.Header>
              {this.state.intervalReports && (
                <Table.Row>
                  <Table.HeaderCell className="table-border-left">
                    مجموع سود
                  </Table.HeaderCell>
                  <Table.HeaderCell>تخفیف</Table.HeaderCell>
                  <Table.HeaderCell>مبلغ</Table.HeaderCell>
                  <Table.HeaderCell>مبلغ نهایی</Table.HeaderCell>
                  <Table.HeaderCell>مجموع اقلام</Table.HeaderCell>
                  <Table.HeaderCell>مجموع فاکتورها</Table.HeaderCell>
                  <Table.HeaderCell>مجموع چک های پرداخت شده</Table.HeaderCell>
                  <Table.HeaderCell>مجموع پرداخت های نقدی</Table.HeaderCell>
                  <Table.HeaderCell>مجموع پرداخت های کارتی</Table.HeaderCell>
                  <Table.HeaderCell>مجموع پرداخت ها</Table.HeaderCell>
                  <Table.HeaderCell>
                    مجموع پرداخت های باقی مانده
                  </Table.HeaderCell>
                  <Table.HeaderCell>فاکتورهای پرداخت نشده</Table.HeaderCell>
                </Table.Row>
              )}
              {!this.state.intervalReports && <NotFound />}
            </Table.Header>

            <Table.Body>
              {this.state.intervalReports && (
                <Table.Row>
                  <Table.Cell
                    className="table-border-left"
                    style={{ fontFamily: "arial" }}
                  >
                    {digitToComma(this.state.intervalReports.total_profit)}
                  </Table.Cell>
                  <Table.Cell style={{ fontFamily: "arial" }}>
                    {digitToComma(this.state.intervalReports.total_discount)}
                  </Table.Cell>
                  <Table.Cell style={{ fontFamily: "arial" }}>
                    {digitToComma(this.state.intervalReports.total_price)}
                  </Table.Cell>
                  <Table.Cell style={{ fontFamily: "arial" }}>
                    {digitToComma(this.state.intervalReports.total_final_price)}
                  </Table.Cell>
                  <Table.Cell style={{ fontFamily: "arial" }}>
                    {digitToComma(this.state.intervalReports.total_items)}
                  </Table.Cell>
                  <Table.Cell style={{ fontFamily: "arial" }}>
                    {digitToComma(this.state.intervalReports.total_bills)}
                  </Table.Cell>
                  <Table.Cell style={{ fontFamily: "arial" }}>
                    {digitToComma(this.state.intervalReports.total_cheque_paid)}
                  </Table.Cell>
                  <Table.Cell style={{ fontFamily: "arial" }}>
                    {digitToComma(this.state.intervalReports.total_cash_paid)}
                  </Table.Cell>
                  <Table.Cell style={{ fontFamily: "arial" }}>
                    {digitToComma(this.state.intervalReports.total_card_paid)}
                  </Table.Cell>
                  <Table.Cell style={{ fontFamily: "arial" }}>
                    {digitToComma(this.state.intervalReports.total_paid)}
                  </Table.Cell>
                  <Table.Cell style={{ fontFamily: "arial" }}>
                    {digitToComma(
                      this.state.intervalReports.total_reminded_payments
                    )}
                  </Table.Cell>
                  <Table.Cell style={{ fontFamily: "arial" }}>
                    {digitToComma(
                      this.state.intervalReports.bills_with_reminded_status
                    )}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        ) : (
          <LoadingBar />
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    intervalReports: state.reports.intervalReports,
  };
};
export default connect(mapStateToProps, {
  getIntervalReports,
})(GeneralStatistics);
