import React, { Component } from "react";
import { connect } from "react-redux";
import { getCustomerUsers } from "../../actions/CustomerSectionActions";
import history from "../../history";

import { Pagination, Table, Search, Grid, Button } from "semantic-ui-react";

import NotFound from "../utils/notFound";
import LoadingBar from "../utils/loadingBar";

class Customers extends Component {
  state = {
    totalPageCount: 1,
    activePage: 1,
    customers: [],
    pk: null
  };

  componentDidMount() {
    this.props.getCustomerUsers(this.state.pk).then(() => {
      this.setState({
        customers: this.props.usersCustomers.results
      });
    });
  }

  changePage = (_, { activePage }) => {
    this.setState({ activePage: activePage }, () => {
      this.props.getCustomerUsers(this.state.activePage);
    });
  };

  handleViewClick = pk => {
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
                    <span className="us-p us-users">مشتریان</span>
                    <Search
                      id="us-search"
                      showNoResults={false}
                      placeholder="جست و جو..."
                      className="placeholder-rtl yekan ltr"
                    />
                  </Grid.Row>
                </Grid>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {this.props.usersCustomers && this.state.customers !== null ? (
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ borderLeft: "1px solid #ddd" }}>
                  نام و نام خانوادگی
                </Table.HeaderCell>
                <Table.HeaderCell>شماره موبایل</Table.HeaderCell>
                <Table.HeaderCell>عملیات</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          ) : null}

          <Table.Body>
            {this.props.usersCustomers && this.state.customers.length !== 0
              ? this.state.customers.map(item => {
                  return (
                    <Table.Row key={item.pk}>
                      <Table.Cell style={{ borderLeft: "1px solid #ddd" }}>
                        <span>{item.first_name}</span>
                        <span>&nbsp;</span>
                        <span>{item.last_name}</span>
                      </Table.Cell>
                      <Table.Cell className="norm-latin">
                        <span>{item.phone_number}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          color="teal"
                          onClick={() => {
                            this.handleViewClick(item.pk);
                            history.push(`/customers/CustomerPage/${item.pk}/`);
                          }}
                        >
                          <span>مشاهده</span>
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              : null}

            {this.props.usersCustomers && !this.state.customers.length ? (
              <LoadingBar />
            ) : null}
            {this.props.usersCustomers &&
            this.props.usersCustomers.results.length === 0 ? (
              <NotFound />
            ) : null}
          </Table.Body>

          {this.props.usersCustomers && this.props.usersCustomers.count > 25 ? (
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="3">
                  <Pagination
                    className="norm-latin ltr"
                    defaultActivePage={1}
                    onPageChange={this.changePage}
                    firstItem={null}
                    lastItem={null}
                    totalPages={Math.ceil(this.props.usersCustomers.count / 25)}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          ) : null}
        </Table>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    usersCustomers: state.customers.usersCustomers
  };
};

export default connect(mapStateToProps, { getCustomerUsers })(Customers);
