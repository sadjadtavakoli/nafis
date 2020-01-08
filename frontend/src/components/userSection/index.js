import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Pagination,
  Table,
  Search,
  Grid,
  Button,
  Icon
} from "semantic-ui-react";
import { getCustomerUsers } from "../../actions/UserSectionActions";
import NotFound from "../utils/notFound";
import LoadingBar from "../utils/loadingBar";
import FactorsModal from "./FactorsModal";
import ChequeModal from "./ChequeModal";

class Users extends Component {
  state = {
    totalPageCount: 1,
    activePage: 1,
    factorsModal: false,
    chequeModal: false,
    pk: null
  };

  componentDidMount() {
    this.props.getCustomerUsers();
  }

  changePage = (_, { activePage }) => {
    this.setState({ activePage: activePage }, () => {
      this.props.getCustomerUsers(this.state.activePage);
    });
  };

  handleFactorsClick = status => {
    this.setState({
      factorsModal: status
    });
  };

  handleChequeClick = status => {
    this.setState({
      chequeModal: status
    });
  };

  componentDidUpdate() {
    // console.log(this.props.usersCustomers.results[0].pk);
  }

  passingPk = pk => {
    this.setState({ pk });
  };

  render() {
    return (
      <React.Fragment>
        <Table celled className="rtl text-center" columns={3}>
          <Table.Header className="text-right">
            <Table.Row>
              <Table.HeaderCell colSpan="4">
                <Grid columns={1}>
                  <Grid.Row className="us-header">
                    <span className="us-p us-users">کاربران</span>
                    <Search className="us-p" />
                  </Grid.Row>
                </Grid>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {this.props.usersCustomers && this.props.usersCustomers !== null ? (
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ borderLeft: "1px solid #ddd" }}>
                  نام
                </Table.HeaderCell>
                <Table.HeaderCell>شماره موبایل</Table.HeaderCell>
                <Table.HeaderCell>عملیات</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          ) : null}

          <Table.Body>
            {!this.props.usersCustomers ? <LoadingBar /> : null}
            {this.props.usersCustomers &&
            this.props.usersCustomers.results.length === 0 ? (
              <NotFound />
            ) : null}
            {this.props.usersCustomers && this.props.usersCustomers !== null
              ? this.props.usersCustomers.results.map(item => {
                  return (
                    <Table.Row key={item.pk}>
                      <Table.Cell style={{ borderLeft: "1px solid #ddd" }}>
                        {item.first_name} {item.last_name}
                      </Table.Cell>
                      <Table.Cell>{item.phone_number}</Table.Cell>
                      <Table.Cell>
                        <Button color="teal" icon labelPosition="right">
                          <Icon name="edit" />
                          <span>ویراش</span>
                        </Button>
                        <Button
                          color="yellow"
                          icon
                          labelPosition="right"
                          onClick={() => {
                            this.handleFactorsClick(true);
                            this.passingPk(item.pk);
                          }}
                        >
                          <Icon name="list" />
                          <span>نمایش فاکتورها</span>
                        </Button>
                        <Button
                          color="yellow"
                          icon
                          labelPosition="right"
                          onClick={() => this.handleChequeClick(true)}
                        >
                          <Icon name="list" />
                          <span>نمایش چک‌ها</span>
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              : null}
          </Table.Body>

          {this.props.usersCustomers && this.props.usersCustomers.count > 25 ? (
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="3">
                  <Pagination
                    onPageChange={this.changePage}
                    totalPages={this.state.totalPageCount}
                    boundaryRange={0}
                    defaultActivePage={1}
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    siblingRange={1}
                    totalPages={Math.ceil(this.props.usersCustomers.count) / 25}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          ) : null}
        </Table>

        <FactorsModal
          isOpen={this.state.factorsModal}
          onClose={() => this.handleFactorsClick(false)}
          passingPk={this.state.pk}
        />

        <ChequeModal
          isOpen={this.state.chequeModal}
          onClose={() => this.handleChequeClick(false)}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    usersCustomers: state.customers.usersCustomers
  };
};

export default connect(mapStateToProps, { getCustomerUsers })(Users);
