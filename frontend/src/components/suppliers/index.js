import React, { Component } from "react";
import { connect } from "react-redux";
import { getSuppliersAction } from "../../actions/SuppliersActions";
import { Table, Grid, Search, Button, Pagination } from "semantic-ui-react";
import NotFound from "../utils/notFound";
import history from "../../history";
import LoadingBar from "../utils/loadingBar";
import Supplier from "./Supplier";

class Suppliers extends Component {
  state = {
    totalPageCount: 1,
    activePage: 1,
    allSuppliers: [],
    loading: true,
    pk: null,
    viewButtonClick: false
  };

  componentDidMount() {
    this.props.getSuppliersAction().then(() => {
      this.setState(
        {
          allSuppliers: this.props.allSuppliers.results
        },
        () => {
          this.setState({ loading: false });
        }
      );
    });
  }

  handleClick = pk => {
    this.setState({ pk, viewButtonClick: true });
  };

  changePage = (_, { activePage }) => {
    this.setState({ activePage: activePage }, () => {
      this.props.getSuppliersAction(this.state.activePage);
    });
  };

  render() {
    return (
      <div>
        <Table celled className="rtl text-center" columns={5}>
          <Table.Header className="text-right">
            <Table.Row>
              <Table.HeaderCell colSpan="5">
                <Grid columns={1}>
                  <Grid.Row>
                    <h2 className="yekan s-h2-padding">تامین کنندگان</h2>
                    <Search
                      showNoResults={false}
                      placeholder="جست و جو..."
                      className="placeholder-rtl yekan ltr"
                    />
                  </Grid.Row>
                </Grid>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Header>
            {!this.state.loading && (
              <Table.Row>
                <Table.HeaderCell style={{ borderLeft: "1px solid #ddd" }}>
                  نام و نام خانوادگی
                </Table.HeaderCell>
                <Table.HeaderCell>ایمیل</Table.HeaderCell>
                <Table.HeaderCell>شماره موبایل</Table.HeaderCell>
                <Table.HeaderCell>آدرس</Table.HeaderCell>
                <Table.HeaderCell>عملیات</Table.HeaderCell>
              </Table.Row>
            )}
          </Table.Header>

          <Table.Body>
            {!this.state.loading && this.state.allSuppliers.length ? (
              this.state.allSuppliers.map(item => {
                return (
                  <Table.Row key={item.pk}>
                    <Table.Cell style={{ borderLeft: "1px solid #ddd" }}>
                      {item.full_name}
                    </Table.Cell>
                    <Table.Cell>
                      <span>{item.email}</span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin">
                      <span>{item.phone_number}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span>{item.address}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        color="teal"
                        onClick={() => {
                          this.handleClick(item.pk);
                          history.push(`/suppliers/supplier/${item.pk}/`);
                        }}
                      >
                        <span>مشاهده</span>
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <LoadingBar />
            )}
            {this.state.allSuppliers.length ? null : <NotFound />}
          </Table.Body>

          {this.props.allSuppliers && this.props.allSuppliers.count > 25 ? (
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="5">
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
        {this.state.viewButtonClick ? <Supplier /> : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    allSuppliers: state.suppliers.suppliers
  };
};

export default connect(mapStateToProps, { getSuppliersAction })(Suppliers);
