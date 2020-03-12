import React, { Component } from "react";
import { Segment, Checkbox, Table } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getAllCheques,
  getRemainedCheques
} from "../../actions/CustomersActions";
import { digitToComma } from "../utils/numberUtils";
import NotFound from "../utils/notFound";
import LoadingBar from "../utils/loadingBar";
import TableLabel from "../utils/tableLabelGenerator";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";

class FactorsTab extends Component {
  state = {
    virgin: true,
    cheques: [],
    remainedChequesToggle: false
  };

  componentDidMount() {
    this.props.getAllCheques(this.props.passingPk).then(() => {
      this.setState({
        virgin: false,
        cheques: this.props.allCheques
      });
    });
  }

  handleToggleClick = () => {
    this.setState(
      { remainedChequesToggle: !this.state.remainedChequesToggle },
      () => {
        if (this.state.remainedChequesToggle) {
          this.props.getRemainedCheques(this.props.passingPk).then(() => {
            this.setState({
              cheques: this.props.remainedCheques
            });
          });
        } else {
          this.props.getAllCheques(this.props.passingPk).then(() => {
            this.setState({
              cheques: this.props.allCheques
            });
          });
        }
      }
    );
  };

  createTable = () => {
    if (this.state.cheques.count) {
      return (
        <Table celled className="text-center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="d-table-border">
                <TableLabel>1</TableLabel>
                شماره
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>2</TableLabel>بانک
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>3</TableLabel>تاریخ صدور
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>4</TableLabel>تاریخ انقضا
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>5</TableLabel>مبلغ
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>6</TableLabel>وضعیت
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.getAllCheques &&
              this.state.cheques.results.map(item => {
                return (
                  <Table.Row>
                    <Table.Cell className="d-table-border">
                      <TableLabel>1</TableLabel>
                      {item.number}
                    </Table.Cell>
                    <Table.Cell>
                      <TableLabel>2</TableLabel>
                      {item.bank}
                    </Table.Cell>
                    <Table.Cell className="norm-latin">
                      <TableLabel>3</TableLabel>
                      <span>{standardTimeToJalaali(item.issue_date)}</span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin">
                      <TableLabel>4</TableLabel>
                      <span>{standardTimeToJalaali(item.expiry_date)}</span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin">
                      <TableLabel>5</TableLabel>
                      <span>{digitToComma(item.amount)} </span>
                      <span className="yekan">تومان</span>
                    </Table.Cell>
                    <Table.Cell>
                      <TableLabel>6</TableLabel>
                      {item.status === "remained" ? "باقی مانده" : "بسته شده"}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
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
        {this.state.virgin ? <LoadingBar /> : null}
        {!this.state.virgin && !this.state.cheques.count ? <NotFound /> : null}
        {this.state.cheques.count ? this.createTable() : null}
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
