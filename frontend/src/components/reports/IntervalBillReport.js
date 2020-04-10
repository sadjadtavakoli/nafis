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
    nextUrl: undefined,
  };
  componentDidMount() {
    this.getIntervalBillReport();
  }
  getIntervalBillReport = () => {
    this.props.getIntervalBillReport(this.state.activePage).then(res => {
      this.setState({
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
  changePage = (_, { activePage }) => {
    this.setState({ activePage });
    // getActiveBill(activePage);
  };
  render() {
    return (
      <Container>
        <DateRange
          nextUrl={this.state.nextUrl}
          activePage={this.state.activePage}
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
          {fetch &&
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
                {fetch &&
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
                  <Table.HeaderCell colSpan={7} className="norm-latin">
                    <Pagination
                      className="norm-latin"
                      defaultActivePage={1}
                      onPageChange={this.changePage}
                      totalPages={this.state.totalPageCount}
                    />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </React.Fragment>
          ) : null}
          {!fetch ? <LoadingBar /> : null}
          {fetch &&
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
