import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getSuppliersAction,
  getSupplierBySearch
} from "../../actions/SuppliersActions";
import {
  Table,
  Grid,
  Search,
  Button,
  Pagination,
  Container,
  Segment
} from "semantic-ui-react";
import NotFound from "../utils/notFound";
import history from "../../history";
import LoadingBar from "../utils/loadingBar";
import TableLabel from "../utils/tableLabelGenerator";
import EditSupplier from "./EditSupplier";
import AddSupplierModal from "./AddSupplierModal";

class Suppliers extends Component {
  state = {
    open: false,
    totalPageCount: 1,
    activePage: 1,
    allSuppliers: [],
    loading: true,
    pk: null,
    viewButtonClick: false,
    notFound: false,
    searchLoading: false
  };

  componentDidMount() {
    this.getSuppliers();
  }

  getSuppliers = (page = 1) => {
    this.props
      .getSuppliersAction(page)
      .then(() => {
        this.setState({
          allSuppliers: this.props.allSuppliers.results,
          loading: false
        });
      })
      .catch(() => {
        this.setState({ notFound: true, loading: false });
      });
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.newSupplier &&
      prevProps.newSupplier.pk !== this.props.newSupplier.pk
    ) {
      this.getSuppliers(this.state.activePage);
    }
  }

  handleClick = pk => {
    this.setState({ pk });
  };

  changePage = (_, { activePage }) => {
    this.setState({ activePage: activePage }, () => {
      this.props.getSuppliersAction(this.state.activePage);
    });
  };

  onClose = () => {
    this.setState({ open: false });
  };

  handleSearchChange = (_, { value }) => {
    this.setState({ notFound: false, searchLoading: true, value }, () => {
      setTimeout(() => {
        if (this.state.value.length < 1) {
          this.getSuppliers(this.state.activePage);
        } else {
          this.props
            .getSupplierBySearch(this.state.value)
            .then(res => {
              this.setState({
                notFound: res.data.length === 0,
                allSuppliers: this.props.allSuppliers,
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

  render() {
    return (
      <Container>
        <AddSupplierModal open={this.state.open} onClose={this.onClose} />
        <Segment stacked className="rtl">
          <h2 className="yekan s-h2-padding">تامین کنندگان</h2>
        </Segment>
        <Table celled className="rtl text-center" columns={6}>
          <Table.Header className="text-right">
            <Table.Row>
              <Table.HeaderCell colSpan="9">
                <Grid>
                  <Grid.Column width={12}>
                    <Search
                      input={{ icon: "search", iconPosition: "left" }}
                      loading={this.state.searchLoading}
                      showNoResults={false}
                      placeholder="جست و جو..."
                      className="placeholder-rtl yekan rtl"
                      id="text-right"
                      onSearchChange={this.handleSearchChange}
                    />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Button
                      className="yekan"
                      onClick={() => this.setState({ open: true })}
                      color="green"
                      content="افزودن تامین کننده جدید"
                      icon="add"
                      labelPosition="right"
                      style={{ fontSize: "13.8px" }}
                    />
                  </Grid.Column>
                </Grid>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Header>
            {!this.state.loading && this.state.allSuppliers.length > 0 ? (
              <Table.Row>
                <Table.HeaderCell style={{ borderLeft: "1px solid #ddd" }}>
                  <TableLabel>1</TableLabel>
                  کد تامین کننده
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>2</TableLabel>
                  نام فروشگاه
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>3</TableLabel>
                  نام مدیریت
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>4</TableLabel>
                  نام خانوادگی مدیریت
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>5</TableLabel>
                  شماره تلفن
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>6</TableLabel>
                  شماره موبایل
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>7</TableLabel>
                  ایمیل
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>8</TableLabel>
                  آدرس
                </Table.HeaderCell>
                <Table.HeaderCell>عملیات</Table.HeaderCell>
              </Table.Row>
            ) : null}
          </Table.Header>

          {!this.state.loading && this.state.allSuppliers.length > 0
            ? this.state.allSuppliers.map(item => {
                return (
                  <Table.Body>
                    <Table.Row key={item.pk}>
                      <Table.Cell
                        collapsing
                        style={{ borderLeft: "1px solid #ddd" }}
                      >
                        <TableLabel>1</TableLabel>
                        {item.pk}
                      </Table.Cell>
                      <Table.Cell collapsing>
                        <TableLabel>2</TableLabel>
                        <span className="yekan">{item.store}</span>
                      </Table.Cell>
                      <Table.Cell collapsing className="norm-latin">
                        <TableLabel>3</TableLabel>
                        <span className="yekan">{item.first_name}</span>
                      </Table.Cell>
                      <Table.Cell collapsing className="norm-latin">
                        <TableLabel>4</TableLabel>
                        <span className="yekan">{item.last_name}</span>
                      </Table.Cell>
                      <Table.Cell collapsing>
                        <TableLabel>5</TableLabel>
                        <span id="norm-latin">{item.phone_number}</span>
                      </Table.Cell>
                      <Table.Cell collapsing>
                        <TableLabel>6</TableLabel>
                        <span id="norm-latin">{item.mobile_number}</span>
                      </Table.Cell>
                      <Table.Cell collapsing>
                        <TableLabel>7</TableLabel>
                        <span id="norm-latin">{item.email}</span>
                      </Table.Cell>
                      <Table.Cell collapsing>
                        <TableLabel>8</TableLabel>
                        <span className="yekan">{item.address}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          className="yekan"
                          content="نمایه"
                          labelPosition="right"
                          color="teal"
                          icon="address card"
                          onClick={() => {
                            this.handleClick(item.pk);
                            history.push(
                              `/suppliers/edit-supplier/${item.pk}/`
                            );
                          }}
                        />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                );
              })
            : null}
          {this.state.loading ? <LoadingBar /> : null}
          {!this.state.loading && !this.state.allSuppliers.length ? (
            <NotFound />
          ) : null}

          {this.props.allSuppliers && this.props.allSuppliers.count > 25 ? (
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="6">
                  <Pagination
                    className="norm-latin ltr"
                    defaultActivePage={1}
                    onPageChange={this.changePage}
                    firstItem={null}
                    lastItem={null}
                    totalPages={Math.ceil(this.props.allSuppliers.count / 25)}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          ) : null}
        </Table>
        {this.state.viewButtonClick ? <EditSupplier /> : null}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return {
    allSuppliers: state.suppliers.suppliers,
    newSupplier: state.suppliers.newSupplier
      ? state.suppliers.newSupplier.pk
      : { pk: 0 }
  };
};

export default connect(mapStateToProps, {
  getSuppliersAction,
  getSupplierBySearch
})(Suppliers);
