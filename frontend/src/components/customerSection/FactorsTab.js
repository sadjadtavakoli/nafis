import React, { Component } from "react";
import { Segment, Checkbox, Table } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getAllBills,
  getRemainedBills
} from "../../actions/CustomerSectionActions";
import NotFound from "../utils/notFound";
import LoadingBar from "../utils/loadingBar";
import { digitToComma } from "../utils/numberUtils";

class FactorsTab extends Component {
  state = {
    bills: [],
    virgin: true,
    remainedBillsToggle: false
  };

  componentDidMount() {
    this.props.getAllBills(this.props.passingPk).then(() => {
      this.setState({
        virgin: false,
        bills: this.props.allBills.results
      });
    });
    this.props.getRemainedBills(this.props.passingPk);
  }

  createTable = () => {
    if (this.state.bills.length !== 0) {
      return (
        <Table celled className="text-center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="d-table-border">
                نام محصول
              </Table.HeaderCell>
              <Table.HeaderCell>کد محصول</Table.HeaderCell>
              <Table.HeaderCell>قیمت واحد</Table.HeaderCell>
              <Table.HeaderCell>مقدار</Table.HeaderCell>
              <Table.HeaderCell>تخفیف</Table.HeaderCell>
              <Table.HeaderCell>قیمت نهایی فاکتو</Table.HeaderCell>
              <Table.HeaderCell>تخفیف کل</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.bills.map(billsItems => {
              return billsItems.items.map(item => {
                return (
                  <Table.Row key={item.pk}>
                    <Table.Cell className="d-table-border">
                      {item.product.name}
                    </Table.Cell>
                    <Table.Cell className="norm-latin">
                      <span>{item.product.code}</span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin">
                      <span>{digitToComma(item.product.selling_price)}</span>
                      <span className="yekan"> تومان</span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin">
                      <span>{item.amount}</span>
                      <span className="yekan"> متر</span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin">
                      <span>{digitToComma(item.final_price)}</span>
                      <span className="yekan"> تومان</span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin">
                      <span>{item.discount}</span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin">
                      <span>{item.total_discount}</span>
                    </Table.Cell>
                  </Table.Row>
                );
              });
            })}
          </Table.Body>
        </Table>
      );
    }
  };

  onClose = () => {
    this.props.onClose();
  };

  handleToggleClick = () => {
    this.setState({ remainedBillsToggle: !this.state.remainedBillsToggle });
    if (!this.state.remainedBillsToggle) {
      this.props.getRemainedBills(this.props.passingPk).then(() => {
        this.setState({
          virgin: false,
          bills: this.props.remainedBills
        });
      });
    }
    if (this.state.remainedBillsToggle) {
      this.props.getAllBills(this.props.passingPk).then(() => {
        this.setState({
          virgin: false,
          bills: this.props.allBills.results
        });
      });
    }
  };

  render() {
    return (
      <div className="rtl text-center">
        <Segment stacked className="text-right us-fm-segment">
          <Checkbox
            toggle
            className="us-fm-toggle"
            onClick={this.handleToggleClick}
          />
          <span className="us-fm-span">نمایش فاکتورهای باقی مانده</span>
        </Segment>
        {this.state.virgin ? <LoadingBar /> : null}
        {!this.state.virgin && !this.state.bills.length ? <NotFound /> : null}
        {this.state.bills.length ? this.createTable() : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state.customers);
  return {
    allBills: state.customers.allBills,
    remainedBills: state.customers.remainedBills
  };
};

export default connect(mapStateToProps, { getAllBills, getRemainedBills })(
  FactorsTab
);
