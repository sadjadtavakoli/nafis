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
import AddSupplierModal from "./AddSupplierModal";

class Suppliers extends Component {
  state = {
    open: false,
    activePage: 1,
    searchLoading: false,
    allSuppliers: []
  };

  componentDidMount() {
    this.getSuppliers();
  }

  getSuppliers = (page = 1) => {
    this.props.getSuppliersAction(page).then(() => {
      this.setState({ allSuppliers: this.props.allSuppliers.results });
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

  changePage = (_, { activePage }) => {
    this.setState({ activePage });
    this.props.getSuppliersAction(activePage);
  };

  onClose = () => {
    this.setState({ open: false });
  };

  handleSearchChange = (_, { value }) => {
    this.setState({ searchLoading: true });
    setTimeout(() => {
      if (value.length < 1) {
        this.getSuppliers(this.state.activePage);
      } else {
        this.props.getSupplierBySearch(value).then(() => {
          this.setState({ allSuppliers: this.props.allSuppliers });
        });
      }
      this.setState({ searchLoading: false });
    }, 300);
  };

  render() {
    return (
      <Container>
        <Segment stacked className="rtl">
          <h2 className="yekan s-h2-padding">تامین کنندگان</h2>
        </Segment>
        <Table celled className="rtl text-center" columns={6}>
          <Table.Header className="text-right">
            <Table.Row>
              <Table.HeaderCell colSpan="9">
                <Grid stackable>
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
            {this.props.allSuppliers && this.state.allSuppliers.length ? (
              <Table.Row>
                <Table.HeaderCell style={{ borderLeft: "1px solid #ddd" }}>
                  <TableLabel count={1}>کد تامین کننده</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel count={2}>نام فروشگاه</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel count={3}>نام مدیریت</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel count={4}>نام خانوادگی مدیریت</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel count={5}>شماره تلفن</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel count={6}>شماره موبایل</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel count={7}>ایمیل</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel count={8}>آدرس</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell style={{ borderLeft: "none" }}>
                  عملیات
                </Table.HeaderCell>
              </Table.Row>
            ) : null}
          </Table.Header>

          {this.props.allSuppliers && this.state.allSuppliers.length
            ? this.state.allSuppliers.map(item => {
                return (
                  <Table.Body>
                    <Table.Row key={item.pk}>
                      <Table.Cell
                        collapsing
                        style={{ borderLeft: "1px solid #ddd" }}
                      >
                        <TableLabel count={1}>
                          <span id="norm-latin">{item.pk}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell collapsing>
                        <TableLabel count={2}>
                          <span className="yekan">{item.store}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell collapsing className="norm-latin">
                        <TableLabel count={3}>
                          <span className="yekan">{item.first_name}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell collapsing className="norm-latin">
                        <TableLabel count={4}>
                          <span className="yekan">{item.last_name}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell collapsing>
                        <TableLabel count={5}>
                          <span id="norm-latin">{item.phone_number}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell collapsing>
                        <TableLabel count={6}>
                          <span id="norm-latin">{item.mobile_number}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell collapsing>
                        <TableLabel count={7}>
                          <span id="norm-latin">{item.email}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell collapsing>
                        <TableLabel count={8}>
                          <span className="yekan">{item.address}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell style={{ borderLeft: "none" }}>
                        <Button
                          className="yekan"
                          content="نمایه"
                          labelPosition="right"
                          color="teal"
                          icon="address card"
                          onClick={() => {
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
          {!this.props.allSuppliers ? <LoadingBar /> : null}
          {this.props.allSuppliers && !this.state.allSuppliers.length ? (
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
        {this.state.open && (
          <AddSupplierModal open={this.state.open} onClose={this.onClose} />
        )}
      </Container>
    );
  }
}

const mapStateToProps = state => {
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
