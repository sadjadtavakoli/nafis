import React, { Component } from "react";
import {
  Segment,
  Checkbox,
  Table,
  Button,
  Search,
  Grid,
  Pagination
} from "semantic-ui-react";
import { connect } from "react-redux";
import { getAllBills, getRemainedBills } from "../../actions/CustomersActions";
import { deleteBill } from "../../actions/CashRegisterActions";
import NotFound from "../utils/notFound";
import LoadingBar from "../utils/loadingBar";
import { digitToComma } from "../utils/numberUtils";
import { standardTimeToJalaali, convertToJalaali } from "../utils/jalaaliUtils";
import history from "../../history";
import { toastr } from "react-redux-toastr";
import TableLabel from "../utils/tableLabelGenerator";

class FactorsTab extends Component {
  state = {
    fetch: false,
    remainedBillsToggle: false,
    searchLoading: false,
    activePage: 1
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.props.getAllBills(this.props.passingPk).then(() => {
      this.setState({
        fetch: true
      });
    });
  };
  handleToggleClick = () => {
    this.setState(
      { remainedBillsToggle: !this.state.remainedBillsToggle, fetch: false },
      () => {
        if (this.state.remainedBillsToggle === true) {
          this.props.getRemainedBills(this.props.passingPk).then(res => {
            this.setState({ fetch: true });
          });
        } else {
          this.fetchData();
        }
      }
    );
  };

  deleteBill = pk => {
    var r = window.confirm("آیا از حذف این مورد مطمئن هستید؟");
    if (r == true) {
      this.props
        .deleteBill(pk)
        .then(() => {
          toastr.success("فاکتور با موفقیت حذف شد");
          this.fetchData();
        })
        .catch(() => {
          toastr.error(
            "خطا در عملیات حذف فاکتور",
            "نمی‌توانید فاکتوری را که پرداخت دارد حذف کنید، ابتدا پرداخت‌ها را حذف نموده سپس نسبت به حذف فاکتور اقدام نمایید"
          );
        });
    }
  };

  handleSearchChange = (_, { value }) => {
    this.setState({ searchLoading: true, value, fetch: false });
    setTimeout(() => {
      if (this.state.value.length < 1) {
        this.fetchData(this.state.activePage);
      } else {
        this.props
          .fetchData(this.state.value)
          .then(() => {
            this.setState({
              notFound: false,
              totalPageCount: 1,
              fetch: true
            });
          })
          .catch(() => {
            this.setState({ notFound: true });
          });
      }
      this.setState({
        searchLoading: false
      });
    }, 300);
  };

  changePage = (_, { activePage }) => {
    this.setState({ activePage }, () => {
      this.props.getAllBills(this.state.activePage);
    });
  };

  createTable = () => {
    let bills = this.state.remainedBillsToggle
      ? this.props.remainedBills
      : this.props.allBills;
    return (
      <Table celled structured className="text-center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              colSpan={this.state.remainedBillsToggle ? "14" : "12"}
            >
              <Grid>
                <Grid.Row columns="2">
                  <Grid.Column verticalAlign="middle" width="2">
                    <h3 className="yekan text-right">
                      {this.state.remainedBillsToggle
                        ? "فاکتورهای‌باقی‌مانده"
                        : "فاکتورها"}
                    </h3>
                  </Grid.Column>
                  <Grid.Column textAlign="right" verticalAlign="middle">
                    <Search
                      input={{ icon: "search", iconPosition: "left" }}
                      loading={this.state.searchLoading}
                      showNoResults={false}
                      placeholder="کد محصول را وارد نمایید"
                      className="placeholder-rtl yekan ltr"
                      onSearchChange={this.handleSearchChange}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="d-table-border">
              <TableLabel>1</TableLabel>
              ردیف
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>2</TableLabel>
              شماره فاکتور
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>3</TableLabel>
              شماره همراه
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>4</TableLabel>
              تاریخ بسته شدن
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>5</TableLabel>
              تعداد اقلام
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>6</TableLabel>
              نام فروشنده
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>7</TableLabel>
              نام صندوق دار
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>8</TableLabel>
              قیمت بدون تخفیف
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>9</TableLabel>
              تخفیف
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>10</TableLabel>
              قیمت کل
            </Table.HeaderCell>
            {this.state.remainedBillsToggle ? (
              <Table.HeaderCell>
                <TableLabel>11</TableLabel>
                بهای پرداخت شده
              </Table.HeaderCell>
            ) : null}
            {this.state.remainedBillsToggle ? (
              <Table.HeaderCell>
                <TableLabel>12</TableLabel>
                بهای پرداختی مانده
              </Table.HeaderCell>
            ) : null}
            <Table.HeaderCell>
              <TableLabel>
                {this.state.remainedBillsToggle ? "13" : "11"}
              </TableLabel>
              حالت فاکتور
            </Table.HeaderCell>
            <Table.HeaderCell>عملیات</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.state.fetch &&
            bills.results.map((bill, index) => {
              return (
                <Table.Row key={bill.pk}>
                  <Table.Cell className="d-table-border" id="norm-latin">
                    <TableLabel>1</TableLabel>
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel>2</TableLabel>
                    <span>{bill.pk}</span>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel>3</TableLabel>
                    <span>{bill.buyer.phone_number}</span>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel>4</TableLabel>
                    {bill.close_date ? (
                      <span>{convertToJalaali(bill.close_date)}</span>
                    ) : (
                      <span className="yekan">ندارد</span>
                    )}
                  </Table.Cell>
                  <Table.Cell id="norm-latin">
                    <TableLabel>5</TableLabel>
                    <span id="norm-latin">{bill.items.length}</span>
                  </Table.Cell>
                  <Table.Cell className="yekan">
                    <TableLabel>6</TableLabel>
                    <span>
                      {bill.seller.ffirst_name}&nbsp;{bill.seller.last_name}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="yekan">
                    <TableLabel>7</TableLabel>
                    <span>
                      {bill.closande ? (
                        <span>
                          {bill.closande.first_name}&nbsp;
                          {bill.closande.last_name}
                        </span>
                      ) : (
                        "موجود نمی باشد"
                      )}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel>8</TableLabel>
                    <span>{digitToComma(bill.price)}</span>&nbsp;
                    <span className="yekan">تومان</span>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel>9</TableLabel>
                    <span>{digitToComma(bill.discount)}</span>&nbsp;
                    <span className="yekan">تومان</span>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel>10</TableLabel>
                    <span>{digitToComma(bill.final_price)}</span>
                    <span className="yekan"> تومان</span>
                  </Table.Cell>
                  {this.state.remainedBillsToggle ? (
                    <Table.Cell className="norm-latin">
                      <TableLabel>11</TableLabel>
                      <span>{digitToComma(bill.paid)}</span>
                      <span className="yekan"> تومان</span>
                    </Table.Cell>
                  ) : null}
                  {this.state.remainedBillsToggle ? (
                    <Table.Cell className="norm-latin">
                      <TableLabel>12</TableLabel>
                      <span>{bill.final_price - bill.paid}</span>
                    </Table.Cell>
                  ) : null}
                  <Table.Cell className="yekan">
                    <TableLabel>
                      {this.state.remainedBillsToggle ? "13" : "11"}
                    </TableLabel>
                    <span>{bill.status === "done" ? "تسویه" : null}</span>
                    <span>{bill.status === "active" ? "باز" : null}</span>
                    <span>{bill.status === "remained" ? "مانده" : null}</span>
                  </Table.Cell>
                  <Table.Cell className="yekan">
                    <Button
                      className="yekan w-100"
                      color="teal"
                      size="mini"
                      onClick={() => {
                        history.push(`/cashregister/${bill.pk}`);
                      }}
                      content="مشاهده"
                      icon="info"
                      labelPosition="right"
                    />
                    <br />
                    <Button
                      className="yekan w-100"
                      color="red"
                      style={{ marginTop: "3px" }}
                      size="mini"
                      onClick={() => this.deleteBill(bill.pk)}
                      content="حذف‌فاکتور"
                      icon="trash"
                      labelPosition="right"
                    />
                    <br />
                    <Button
                      className="yekan w-100"
                      color="teal"
                      style={{ marginTop: "3px" }}
                      size="mini"
                      onClick={() => {
                        history.push(`/factor/${bill.pk}/print`);
                      }}
                      content="چاپ‌فاکتور"
                      icon="print"
                      labelPosition="right"
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
        {this.props.allBills && this.props.allBills.count > 25 ? (
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell
                colSpan={this.state.remainedBillsToggle ? "14" : "12"}
              >
                <Pagination
                  className="norm-latin ltr"
                  defaultActivePage={1}
                  onPageChange={this.changePage}
                  firstItem={null}
                  lastItem={null}
                  totalPages={this.props.allBills.count / 25}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        ) : null}
      </Table>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Segment stacked className="text-right us-fm-segment">
          <Checkbox
            toggle
            className="us-fm-toggle"
            onClick={this.handleToggleClick}
          />
          <span className="us-fm-span">نمایش فاکتورهای باقی مانده</span>
        </Segment>
        {this.state.fetch ? this.createTable() : <LoadingBar />}
        {this.state.fetch && !this.props.allBills.count ? <NotFound /> : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    allBills: state.customers.allBills,
    remainedBills: state.customers.remainedBills
  };
};

export default connect(mapStateToProps, {
  getAllBills,
  getRemainedBills,
  deleteBill
})(FactorsTab);
