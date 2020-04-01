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
                <TableLabel count={1}>شماره</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={2}>بانک</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={3}>تاریخ صدور</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={4}>تاریخ انقضا</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={5}>مبلغ</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={6}>وضعیت</TableLabel>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.getAllCheques &&
              this.state.cheques.results.map(item => {
                return (
                  <Table.Row>
                    <Table.Cell className="d-table-border">
                      <TableLabel count={1}>{item.number}</TableLabel>
                    </Table.Cell>
                    <Table.Cell>
                      <TableLabel count={2}>{item.bank}</TableLabel>
                    </Table.Cell>
                    <Table.Cell className="norm-latin">
                      <TableLabel count={3}>
                        <span>{standardTimeToJalaali(item.issue_date)}</span>
                      </TableLabel>
                    </Table.Cell>
                    <Table.Cell className="norm-latin">
                      <TableLabel count={4}>
                        <span>{standardTimeToJalaali(item.expiry_date)}</span>
                      </TableLabel>
                    </Table.Cell>
                    <Table.Cell className="norm-latin">
                      <TableLabel count={5}>
                        <span className="yekan">تومان</span>
                        <span>{digitToComma(item.amount)} </span>
                      </TableLabel>
                    </Table.Cell>
                    <Table.Cell>
                      <TableLabel count={6}>
                        {item.status === "remained" ? "باقی مانده" : "بسته شده"}
                      </TableLabel>
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
