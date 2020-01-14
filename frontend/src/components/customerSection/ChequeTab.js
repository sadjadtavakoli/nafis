import React, { Component } from "react";
import { Segment, Checkbox, Table } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getAllCheques,
  getRemainedCheques
} from "../../actions/CustomerSectionActions";
import { digitToComma } from "../utils/numberUtils";
import NotFound from "../utils/notFound";

class FactorsTab extends Component {
  state = {
    virgin: true,
    cheques: [],
    remainedCheques: false
  };

  componentDidMount() {
    this.props.getAllCheques(this.props.passingPk).then(() => {
      this.setState({
        virgin: false,
        cheques: this.props.allCheques
      });
      console.log(this.props.allCheques);
    });
  }

  onClose = () => {
    this.props.onClose();
  };

  handleToggleClick = () => {
    this.setState({
      remainedCheques: !this.state.remainedCheques
    });
    if (this.state.remainedCheques) {
      this.setState({
        cheques: this.props.allCheques
      });
    } else {
      this.props.getRemainedCheques(this.props.passingPk);
      this.setState({
        cheques: this.props.remainedCheques
      });
    }
  };

  createTable = () => {
    if (this.state.cheques.length !== 0) {
      return (
        <Table celled className="text-center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="d-table-border">
                شماره
              </Table.HeaderCell>
              <Table.HeaderCell>بانک</Table.HeaderCell>
              <Table.HeaderCell>تاریخ صدور</Table.HeaderCell>
              <Table.HeaderCell>تاریخ انقضا</Table.HeaderCell>
              <Table.HeaderCell>مبلغ</Table.HeaderCell>
              <Table.HeaderCell>وضعیت</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="d-table-border">
                {this.state.cheques[0].number}
              </Table.Cell>
              <Table.Cell>{this.state.cheques[0].bank}</Table.Cell>
              <Table.Cell className="norm-latin">
                <span>{this.state.cheques[0].issue_date}</span>
              </Table.Cell>
              <Table.Cell className="norm-latin">
                <span>{this.state.cheques[0].expiry_date}</span>
              </Table.Cell>
              <Table.Cell className="norm-latin">
                <span>{digitToComma(this.state.cheques[0].amount)} </span>
                <span className="yekan">تومان</span>
              </Table.Cell>
              <Table.Cell>
                {this.state.cheques[0].status === "remained"
                  ? "باقی مانده"
                  : "بسته شده"}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
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
          <span className="us-fm-span">نمایش چک های باقی مانده</span>
        </Segment>
        {this.state.virgin ? this.createTable() : <NotFound />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    allCheques: state.customers.allCheques,
    remainedCheques: state.customers.remainedCheques
  };
};

export default connect(mapStateToProps, { getAllCheques, getRemainedCheques })(
  FactorsTab
);
