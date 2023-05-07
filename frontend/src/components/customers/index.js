import React, { Component } from "react";
import { connect } from "react-redux";
import history from "../../history";
import { isPermit } from "../mainPage/permission";
import {
  deleteCustomer,
  getCustomerBySearch,
  getCustomerUsers
} from "../../actions/CustomersActions";
import { toastr } from "react-redux-toastr";
import LoadingBar from "../utils/loadingBar";
import TableLabel from "../utils/tableLabelGenerator";
import NotFound from "../utils/notFound";
import AddCustomerModal from "./addCustomerModal";

import {
  Container,
  Pagination,
  Table,
  Button,
  Segment,
  Search,
  Grid
} from "semantic-ui-react";

class Customers extends Component {
  state = {
    totalPageCount: 1,
    activePage: 1,
    customers: [],
    pk: null,
    loading: true,
    open: false,
    productID: NaN,
    width: window.innerWidth
  };

  componentDidMount() {
    this.getCustomers();
    this.setJob();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.newCustomer &&
      prevProps.newCustomer.pk !== this.props.newCustomer.pk
    ) {
      this.getCustomers(this.state.activePage);
    }
  }

  getCustomers = (page = 1) => {
    this.props.getCustomerUsers(page).then(() => {
      this.setState({
        customers: this.props.usersCustomers.results,
        loading: false
      });
    });
  };

  setJob = () => {
    this.setState({ job: localStorage.getItem("type") });
  };

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
          toastr.error(
            "خطا در عملیات حذف مشتری (مشتریانی که فاکتور و یا چک فعال دارند را نمیتوان حذف کرد)"
          );
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

  handleSearchChange = (_, { value }) => {
    this.setState({ notFound: false, searchLoading: true, value }, () => {
      setTimeout(() => {
        if (this.state.value.length < 1) {
          this.getCustomers(this.state.activePage);
        } else {
          this.props
            .getCustomerBySearch(this.state.value)
            .then(res => {
              this.setState({
                notFound: res.data.length === 0,
                customers: this.props.usersCustomers,
                totalPageCount: 1
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
    });
  };

  searchBar = () => {
    return (
      <Search
        input={{ icon: "search", iconPosition: "left" }}
        loading={this.state.searchLoading}
        showNoResults={false}
        placeholder="کد محصول را وارد نمایید"
        className="rtl placeholder-rtl yekan text-right"
        onSearchChange={this.handleSearchChange}
      />
    );
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
            <Table.HeaderCell colSpan="3">
              <Grid columns={1} style={{ margin: "0.25em 0" }}>
                <h2 className="yekan">لیست مشتریان موجود</h2>
                {this.searchBar()}
              </Grid>
            </Table.HeaderCell>
            {this.state.customers && this.state.customers.length > 0 ? (
              <Table.Row className="text-center">
                <Table.HeaderCell style={{ borderLeft: "1px solid #ddd" }}>
                  <TableLabel count={1}>نام و نام خانوادگی</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel count={2}>شماره موبایل</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell>عملیات</Table.HeaderCell>
              </Table.Row>
            ) : null}
          </Table.Header>
          <Table.Body>
            {this.state.customers && this.state.customers.length > 0
              ? this.state.customers.map(item => {
                  return (
                    <Table.Row key={item.pk}>
                      <Table.Cell
                        collapsing
                        style={{ borderLeft: "1px solid #ddd" }}
                      >
                        <TableLabel count={1}>
                          <span>{item.first_name}</span>
                          <span>&nbsp;</span>
                          <span>{item.last_name}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell collapsing className="norm-latin">
                        <TableLabel count={2}>
                          <span>{item.phone_number}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          className="m-1 yekan"
                          color="teal"
                          icon="address card"
                          labelPosition="right"
                          content="نمایه مشتری"
                          onClick={() => {
                            this.handleViewClick(item.pk);
                            history.push(`/customers/customer/${item.pk}/`);
                          }}
                        ></Button>
                        {isPermit("admin", this.state.job) ? (
                          <Button
                            className="m-1 yekan"
                            color="red"
                            labelPosition="right"
                            icon="trash"
                            content="حذف"
                            onClick={() => {
                              this.deleteCustomer(item.pk);
                            }}
                          ></Button>
                        ) : null}
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              : null}
            {this.state.loading ? <LoadingBar /> : null}
            {this.state.notFound ? <NotFound /> : null}
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
    usersCustomers: state.customers.usersCustomers,
    newCustomer: state.customers.newCustomer
      ? state.customers.newCustomer.pk
      : { pk: 0 }
  };
};

export default connect(mapStateToProps, {
  getCustomerUsers,
  deleteCustomer,
  getCustomerBySearch
})(Customers);
