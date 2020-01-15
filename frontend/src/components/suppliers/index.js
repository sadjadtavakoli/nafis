import React, { Component } from "react";
import { connect } from "react-redux";
import { getSuppliersAction } from "../../actions/SuppliersActions";
import { Table, Grid, Search, Button, Pagination } from "semantic-ui-react";

class Suppliers extends Component {
  componentDidMount() {
    this.props.getSuppliersAction();
  }

  componentDidUpdate() {
    console.log(this.props.suppliers);
  }

  render() {
    return (
      <div>
        <React.Fragment>
          <Table celled className="rtl text-center" columns={3}>
            <Table.Header className="text-right">
              <Table.Row>
                <Table.HeaderCell colSpan="4">
                  <Grid columns={1}>
                    <Grid.Row className="us-header">
                      <span className="us-p us-users">تامین کنندگان</span>
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

            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ borderLeft: "1px solid #ddd" }}>
                  نام و نام خانوادگی
                </Table.HeaderCell>
                <Table.HeaderCell>شماره موبایل</Table.HeaderCell>
                <Table.HeaderCell>عملیات</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell style={{ borderLeft: "1px solid #ddd" }}>
                  first name last name
                </Table.Cell>
                <Table.Cell className="norm-latin">
                  <span>phone number</span>
                </Table.Cell>
                <Table.Cell>
                  <Button color="teal">
                    <span>مشاهده</span>
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>

            {this.props.usersCustomers &&
            this.props.usersCustomers.count > 25 ? (
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="3">
                    <Pagination
                      className="norm-latin ltr"
                      defaultActivePage={1}
                      onPageChange={this.changePage}
                      firstItem={null}
                      lastItem={null}
                      totalPages={Math.ceil(
                        this.props.usersCustomers.count / 25
                      )}
                    />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            ) : null}
          </Table>
        </React.Fragment>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    suppliers: state.suppliers
  };
};

export default connect(mapStateToProps, { getSuppliersAction })(Suppliers);
