import React, { Component } from "react";
import { Segment, Checkbox, Table, Button, Label } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getAllBills,
  getRemainedBills
} from "../../actions/CustomerSectionActions";
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
    remainedBillsToggle: false
  };

  componentDidMount() {
    this.fetchData();
  }
  fetchData() {
    this.props.getAllBills(this.props.passingPk).then(() => {
      this.setState({
        fetch: true
      });
    });
    this.props.getRemainedBills(this.props.passingPk);
  }
  handleToggleClick = () => {
    this.setState({ remainedBillsToggle: !this.state.remainedBillsToggle });
    if (!this.state.remainedBillsToggle) {
      this.props.getRemainedBills(this.props.passingPk).then(() => {
        this.setState({
          bills: this.props.remainedBills
        });
      });
    }
    if (this.state.remainedBillsToggle) {
      this.props.getAllBills(this.props.passingPk).then(() => {
        this.setState({
          bills: this.props.allBills
        });
      });
    }
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

  createTable = () => {
    let bills = this.props.allBills;
    // console.log("results", bills.results);
    return (
      <Table celled structured className="text-center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="20">
              <h3 className="yekan text-right">
                {this.state.remainedBillsToggle
                  ? "فاکتور های باقی مانده"
                  : "فاکتور ها"}
              </h3>
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
              شماره همراه
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>3</TableLabel>
              تاریخ بسته شدن
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>4</TableLabel>
              تعداد اقلام
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>5</TableLabel>
              نام فروشنده
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>6</TableLabel>
              نام صندوق دار
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>7</TableLabel>
              قیمت بدون تخفیف
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>8</TableLabel>
              تخفیف
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel>9</TableLabel>
              قیمت کل
            </Table.HeaderCell>
            {this.state.remainedBillsToggle ? (
              <Table.HeaderCell>
                <TableLabel>10</TableLabel>
                بهای پرداخت شده
              </Table.HeaderCell>
            ) : null}
            {this.state.remainedBillsToggle ? (
              <Table.HeaderCell>
                <TableLabel>11</TableLabel>
                بهای پرداختی مانده
              </Table.HeaderCell>
            ) : null}
            <Table.HeaderCell>
              <TableLabel>12</TableLabel>
              حالت فاکتور
            </Table.HeaderCell>
            <Table.HeaderCell>عملیات</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bills.results.map((bill, index) => {
            return (
              <Table.Row key={bill.pk}>
                <Table.Cell className="d-table-border" id="norm-latin">
                  <TableLabel>1</TableLabel>
                  {index + 1}
                </Table.Cell>
                <Table.Cell className="norm-latin">
                  <TableLabel>2</TableLabel>
                  <span>{bill.buyer.phone_number}</span>
                </Table.Cell>
                <Table.Cell className="norm-latin">
                  <TableLabel>3</TableLabel>
                  {bill.close_date ? (
                    <span>
                      {standardTimeToJalaali(convertToJalaali(bill.close_date))}
                    </span>
                  ) : (
                    <span className="yekan">ندارد</span>
                  )}
                </Table.Cell>
                <Table.Cell id="norm-latinr">
                  <TableLabel>4</TableLabel>
                  {bill.items.length}
                </Table.Cell>
                <Table.Cell className="yekan">
                  <TableLabel>5</TableLabel>
                  <span>
                    {bill.seller.first_name}&nbsp;{bill.seller.last_name}
                  </span>
                </Table.Cell>
                <Table.Cell className="yekan">
                  <TableLabel>6</TableLabel>
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
                  <TableLabel>7</TableLabel>
                  <span>{digitToComma(bill.price)}</span>&nbsp;
                  <span className="yekan">تومان</span>
                </Table.Cell>
                <Table.Cell className="norm-latin">
                  <TableLabel>8</TableLabel>
                  <span>{digitToComma(bill.discount)}</span>&nbsp;
                  <span className="yekan">تومان</span>
                </Table.Cell>
                <Table.Cell className="norm-latin">
                  <TableLabel>9</TableLabel>
                  <span>{digitToComma(bill.final_price)}</span>
                  <span className="yekan"> تومان</span>
                </Table.Cell>
                {this.state.remainedBillsToggle ? (
                  <Table.Cell className="norm-latin">
                    <TableLabel>10</TableLabel>
                    <span>{digitToComma(bill.paid)}</span>
                    <span className="yekan"> تومان</span>
                  </Table.Cell>
                ) : null}
                {this.state.remainedBillsToggle ? (
                  <Table.Cell className="norm-latin">
                    <TableLabel>11</TableLabel>
                    <span>{bill.final_price - bill.paid}</span>
                  </Table.Cell>
                ) : null}
                <Table.Cell className="yekan">
                  <TableLabel>12</TableLabel>
                  <span>{bill.status === "done" ? "تسویه" : null}</span>
                  <span>{bill.status === "active" ? "باز" : null}</span>
                  <span>{bill.status === "remained" ? "مانده" : null}</span>
                </Table.Cell>
                <Table.Cell className="yekan">
                  <Button
                    className="yekan"
                    color="teal"
                    size="mini"
                    onClick={() => {
                      history.push(`/cashregister/${bill.pk}`);
                    }}
                  >
                    مشاهده
                  </Button>
                  <br />
                  <Button
                    className="yekan"
                    color="red"
                    style={{ marginTop: "3px" }}
                    size="mini"
                    onClick={() => this.deleteBill(bill.pk)}
                  >
                    حذف کل فاکتور
                  </Button>
                  <br />
                  <Button
                    className="yekan"
                    color="teal"
                    style={{ marginTop: "3px" }}
                    size="mini"
                    onClick={() => {
                      history.push(`/factor/${bill.pk}/print`);
                    }}
                  >
                    چاپ فاکتور
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
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
