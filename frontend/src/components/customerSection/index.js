import React, { Component } from "react";
import { connect } from "react-redux";
import { getCustomerUsers } from "../../actions/CustomerSectionActions";
import history from "../../history";
import { isPermit } from "../mainPage/permission";
import { deleteCustomer } from "../../actions/CustomerSectionActions";
import { toastr } from "react-redux-toastr";
import LoadingBar from "../utils/loadingBar";
import NotFound from "../utils/notFound";
import AddCustomerModal from "./addCustomerModal";

import {
  Container,
  Pagination,
  Table,
  Search,
  Grid,
  Button,
  Segment
} from "semantic-ui-react";

class Customers extends Component {
  state = {
    totalPageCount: 1,
    activePage: 1,
    customers: [],
    pk: null,
    loading: true,
    open: false,
    productID: NaN
  };

  componentDidMount() {
    this.props.getCustomerUsers(this.state.activePage).then(() => {
      this.setState(
        {
          customers: this.props.usersCustomers.results
        },
        () => {
          this.setState({ loading: false });
        }
      );
    });
    this.setJob();
  }

  changePage = (_, { activePage }) => {
    this.setState({ activePage: activePage }, () => {
      this.props.getCustomerUsers(this.state.activePage).then(() => {
        this.setState(
          {
            customers: this.props.usersCustomers.results
          },
          () => {
            this.setState({ loading: false });
          }
        );
      });
    });
  };

  setJob = () => {
    this.setState({ job: localStorage.getItem("type") });
  };

  deleteCustomer = pk => {
    let confirm = window.confirm(`آیا از حذف این مشتری مطمئن هستید؟`);
    if (confirm === true) {
      this.props
        .deleteCustomer(pk)
        .then(() => {
          this.props.getCustomerUsers(this.state.activePage).then(() => {
            this.setState(
              {
                customers: this.props.usersCustomers.results
              },
              () => {
                this.setState({ loading: false });
              }
            );
          });
          toastr.success("مشتری حذف گردید");
        })
        .catch(() => {
          toastr.error("خطا در عملیات حذف مشتری");
        });
    }
  };

  handleViewClick = pk => {
    this.setState({ pk });
  };

  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <Container>
        <Segment stacked className="rtl">
          <AddCustomerModal
            open={this.state.open}
            code={this.state.productID}
            onClose={this.closeModal}
          />
          <Button
            className="yekan"
            onClick={this.openModal}
            color="green"
            content="افزودن مشتری جدید"
            icon="add"
            labelPosition="right"
          />
        </Segment>
        <Table celled className="rtl text-center" columns={3}>
          <Table.Header className="text-right">
            <Table.Row>
              <Table.HeaderCell colSpan="3">
                <Grid>
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

          {this.props.usersCustomers &&
          this.props.usersCustomers.results.length !== 0 ? (
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
                            history.push(`/customers/customer/${item.pk}/`);
                          }}
                        >
                          <span>ویرایش</span>
                        </Button>
                        {isPermit("adminOnly", this.state.job) ? (
                          <Button
                            color="red"
                            onClick={() => {
                              this.deleteCustomer(item.pk);
                            }}
                          >
                            <span>حذف</span>
                          </Button>
                        ) : null}
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              : null}

            {this.state.loading ? <LoadingBar /> : null}
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
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    usersCustomers: state.customers.usersCustomers
  };
};

export default connect(mapStateToProps, { getCustomerUsers, deleteCustomer })(
  Customers
);
