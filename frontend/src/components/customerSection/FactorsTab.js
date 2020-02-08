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
      this.setState(
        {
          virgin: false,
          bills: this.props.allBills
        },
        () => {
          console.log("map", this.state.bills.results);
        }
      );
    });
    this.props.getRemainedBills(this.props.passingPk);
  }

  createTable = () => {
    let rowSpan = this.state.bills.results[0].items.length;
    console.log("row span", rowSpan);
    if (this.state.bills.count) {
      return (
        <Table celled structured className="text-center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="d-table-border">
                نام محصول
              </Table.HeaderCell>
              <Table.HeaderCell>کد</Table.HeaderCell>
              <Table.HeaderCell>قیمت واحد</Table.HeaderCell>
              <Table.HeaderCell>مقدار</Table.HeaderCell>
              <Table.HeaderCell>تخفیف کل</Table.HeaderCell>
              {this.state.remainedBillsToggle ? (
                <Table.HeaderCell>بهای پرداخت شده</Table.HeaderCell>
              ) : null}
              <Table.HeaderCell>قیمت نهایی فاکتو</Table.HeaderCell>
              {this.state.remainedBillsToggle ? (
                <Table.HeaderCell>بهای پرداختی مانده</Table.HeaderCell>
              ) : null}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.bills.results.map(item => {
              return (
                <Table.Row key={item.pk}>
                  {item.items.map(subitem => {
                    return (
                      <React.Fragment>
                        <Table.Cell className="d-table-border">
                          {subitem.product.name}
                        </Table.Cell>
                        <Table.Cell className="norm-latin">
                          <span>{subitem.product.code}</span>
                        </Table.Cell>
                        <Table.Cell className="norm-latin">
                          <span>
                            {digitToComma(subitem.product.selling_price)}
                          </span>
                          <span className="yekan"> تومان</span>
                        </Table.Cell>
                        <Table.Cell className="norm-latin">
                          <span>{subitem.amount}</span>
                          <span className="yekan"> متر</span>
                        </Table.Cell>
                      </React.Fragment>
                    );
                  })}
                  <Table.Cell className="norm-latin">
                    <span>{item.total_discount}</span>
                  </Table.Cell>
                  {this.state.remainedBillsToggle ? (
                    <Table.Cell>
                      <span>{digitToComma(item.paid)}</span>
                      <span className="yekan"> تومان</span>
                    </Table.Cell>
                  ) : null}
                  <Table.Cell className="norm-latin">
                    <span>{digitToComma(item.final_price)}</span>
                    <span className="yekan"> تومان</span>
                  </Table.Cell>
                  {this.state.remainedBillsToggle ? (
                    <Table.Cell>
                      <span>{item.final_price - item.paid}</span>
                    </Table.Cell>
                  ) : null}
                </Table.Row>
              );
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
        {!this.state.virgin && !this.state.bills.count ? <NotFound /> : null}
        {this.state.bills.count ? this.createTable() : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    allBills: state.customers.allBills,
    remainedBills: state.customers.remainedBills
  };
};

export default connect(mapStateToProps, { getAllBills, getRemainedBills })(
  FactorsTab
);
