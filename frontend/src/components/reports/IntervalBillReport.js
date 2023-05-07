import React, { Component } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  Button,
  Icon,
  Container,
  Pagination,
  Grid,
} from "semantic-ui-react";
import { getIntervalBillReport } from "../../actions/ReportsActions";
import { priceToPersian } from "../utils/numberUtils";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import TableLabel from "../utils/tableLabelGenerator";
import NotFound from "../utils/notFound";
import LoadingBar from "../utils/loadingBar";
import "../../scss/bootstrap.scss";
import DateRange from "./DateRange";
import { connect } from "react-redux";
class IntervalBillReport extends Component {
  state = {
    fetch: false,
    totalPageCount: 1,
    activePage: 1,
    report: undefined,
  };
  getIntervalBillReport = (page = 1, start_date, end_date) => {
    this.setState({ fetch: false });
    this.props.getIntervalBillReport(page, start_date, end_date).then(res => {
      this.setState({
        activePage: page,
        report: this.props.intervalBillReport,
        fetch: true,
        totalPageCount: Math.ceil(this.props.intervalBillReport.count / 25),
      });
    });
  };
  componentWillReceiveProps(newProps) {
    this.setState({
      report: newProps.intervalBillReport,
      totalPageCount: Math.ceil(newProps.intervalBillReport.count / 25),
    });
  }
  findGetParameter = (_URL, parameterName) => {
    let url = new URL(_URL);
    let params = new URLSearchParams(url.search);
    let result = params.get(parameterName);
    return result;
  };
  changePage = (_, { activePage }) => {
    this.setState({ activePage }, () => {
      let next = this.state.report.next;
      let start_date = this.findGetParameter(next, "start_date");
      let end_date = this.findGetParameter(next, "end_date");
      this.getIntervalBillReport(this.state.activePage, start_date, end_date);
    });
  };
  fetchHandler = status => {
    this.setState({
      fetch: status,
    });
  };
  render() {
    return (
      <Container>
        <DateRange
          fetchHandler={this.fetchHandler}
          pageName={"IntervalBillReport"}
        />

        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="text-right" colSpan="12">
                فاکتور های بسته شده
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {this.state.fetch &&
          this.state.report &&
          Object.keys(this.state.report.results).length ? (
            <React.Fragment>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="text-center">
                    عملیات
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={10}> قیمت کل</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={9}> قیمت خام بدون تخفیف</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={8}> تخفیف کل</TableLabel>
                  </Table.HeaderCell>
                  {window.localStorage.type === "admin" ? (
                    <Table.HeaderCell className="text-center">
                      <TableLabel count={7}> سود</TableLabel>
                    </Table.HeaderCell>
                  ) : null}
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={6}> تعداد اقلام</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={5}> تاریخ بسته شدن</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={4}> شماره تلفن خریدار</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={3}> شعبه</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={2}> نام فروشنده</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={1}> شماره فاکتور</TableLabel>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.fetch &&
                this.state.report &&
                Object.keys(this.state.report.results).length
                  ? this.state.report.results.map(item => {
                      return (
                        <Table.Row>
                          <Table.Cell
                            className="text-center norm-latin"
                            collapsing
                          >
                            <Button
                              as="a"
                              href={`/factor/${item.pk}/print`}
                              target="_blank"
                              icon
                              labelPosition="right"
                              color="yellow"
                            >
                              <span className="yekan">چاپ فاکتور</span>
                              <Icon name="print" />
                            </Button>
                          </Table.Cell>
                          <Table.Cell
                            className="text-center norm-latin"
                            collapsing
                          >
                            <TableLabel count={10}>
                              <span>{priceToPersian(item.final_price)}</span>
                            </TableLabel>
                          </Table.Cell>
                          <Table.Cell
                            className="text-center norm-latin"
                            collapsing
                          >
                            <TableLabel count={9}>
                              <span>{priceToPersian(item.price)}</span>
                            </TableLabel>
                          </Table.Cell>
                          <Table.Cell
                            className="text-center norm-latin"
                            collapsing
                          >
                            <TableLabel count={8}>
                              <span>{priceToPersian(item.total_discount)}</span>
                            </TableLabel>
                          </Table.Cell>
                          {window.localStorage.type === "admin" ? (
                            <Table.Cell
                              className="text-center norm-latin"
                              collapsing
                            >
                              <TableLabel count={7}>
                                <span>{priceToPersian(item.profit)}</span>
                              </TableLabel>
                            </Table.Cell>
                          ) : null}
                          <Table.Cell
                            className="text-center norm-latin"
                            collapsing
                          >
                            <TableLabel count={6}>
                              <span>{item.items_count}</span>
                            </TableLabel>
                          </Table.Cell>
                          <Table.Cell
                            className="text-center norm-latin"
                            collapsing
                          >
                            <TableLabel count={5}>
                              <span>
                                {standardTimeToJalaali(item.close_date)}
                              </span>
                            </TableLabel>
                          </Table.Cell>
                          <Table.Cell
                            className="text-center norm-latin"
                            collapsing
                          >
                            <TableLabel count={4}>
                              <span>{item.buyer.phone_number}</span>
                            </TableLabel>
                          </Table.Cell>
                          <Table.Cell
                            className="text-center norm-latin"
                            collapsing
                          >
                            <TableLabel count={3}>
                              <span>{item.branch && item.branch.name}</span>
                            </TableLabel>
                          </Table.Cell>
                          <Table.Cell
                            className="text-center norm-latin"
                            collapsing
                          >
                            <TableLabel count={2}>
                              <span>{item.seller.username}</span>
                            </TableLabel>
                          </Table.Cell>
                          <Table.Cell
                            className="text-center norm-latin"
                            collapsing
                          >
                            <TableLabel count={1}>
                              <span>{item.bill_code}</span>
                            </TableLabel>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })
                  : null}
              </Table.Body>
              <Table.Footer fullWidth hidden={this.state.totalPageCount < 2}>
                <Table.Row>
                  <Table.HeaderCell colSpan={11} className="norm-latin">
                    <Pagination
                      className="norm-latin"
                      defaultActivePage={1}
                      activePage={this.state.activePage}
                      onPageChange={this.changePage}
                      totalPages={this.state.totalPageCount}
                    />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </React.Fragment>
          ) : null}
          {!this.state.fetch ? <LoadingBar /> : null}
          {this.state.fetch &&
          this.state.report &&
          !Object.keys(this.state.report.results).length ? (
            <NotFound />
          ) : null}
        </Table>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    intervalBillReport: state.reports.intervalBillReport,
  };
};
export default connect(mapStateToProps, { getIntervalBillReport })(
  IntervalBillReport
);
