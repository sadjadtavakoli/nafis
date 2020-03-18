import React from "react";
import { connect } from "react-redux";
import { Table, Pagination, Grid, Search, Button } from "semantic-ui-react";
import {
  getProductsList,
  getProductsByCode
} from "../../actions/DepositoryActions";
import { digitToComma } from "../utils/numberUtils";
import LoadingBar from "../utils/loadingBar";
import TableLabel from "../utils/tableLabelGenerator";
import NotFound from "../utils/notFound";
import history from "../../history";

class ProductTable extends React.Component {
  state = {
    productsList: [],
    totalPageCount: 1,
    activePage: 1,
    notFound: false,
    width: 0,
    customers: []
  };

  componentDidMount() {
    this.getProductsList();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.productsList && newProps.productsList.results) {
      this.setState({
        notFound: false,
        productsList: newProps.productsList.results
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  getProductsList = (page = 1) => {
    this.props.getProductsList(page).then(() => {
      this.setState({
        notFound: false,
        productsList: this.props.productsList.results,
        totalPageCount: this.props.productsList
          ? Math.ceil(this.props.productsList.count / 25)
          : 1
      });
    });
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  changePage = (_, { activePage }) => {
    this.setState({ activePage });
    this.getProductsList(activePage);
  };

  handleSearchChange = (_, { value }) => {
    this.setState({ searchLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) {
        this.getProductsList(this.state.activePage);
      } else {
        this.props
          .getProductsByCode(this.state.value)
          .then(() => {
            this.setState({
              notFound: false,
              productsList: [this.props.productsList],
              totalPageCount: 1
            });
          })
          .catch(() => {
            this.setState({ notFound: true, noResult: true, productsList: [] });
          });
      }
      this.setState({
        searchLoading: false
      });
    }, 300);
  };

  searchBar = () => {
    return (
      <Search
        input={{ icon: "search", iconPosition: "left" }}
        loading={this.state.searchLoading}
        showNoResults={false}
        placeholder="کد محصول را وارد نمایید"
        className="placeholder-rtl yekan ltr"
        onSearchChange={this.handleSearchChange}
        style={{ marginRight: "10px" }}
      />
    );
  };

  render() {
    return (
      <div>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                colSpan={this.props.edit ? "10" : "9"}
                className="rtl text-right"
              >
                <Grid>
                  <Grid.Row>
                    <h3 className="yekan" style={{ margin: "0 20px 0 0" }}>
                      لیست محصولات موجود
                    </h3>
                    {this.searchBar()}
                  </Grid.Row>
                </Grid>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {this.state.productsList.length > 0 ? (
            <React.Fragment>
              <Table.Header>
                <Table.Row>
                  {this.props.edit ? (
                    <Table.HeaderCell className="text-center">
                      عملیات
                    </Table.HeaderCell>
                  ) : null}
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={9}>رنگ پس زمینه</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={8}>رنگ طرح</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={7}>جنس</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={6}>نوع پارچه</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={5}>نوع طرح</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={4}>مقدار باقی مانده</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={3}>قیمت فروش</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={2}>نام محصول</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={1}>کد محصول</TableLabel>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.state.productsList.map((item, index) => {
                  return (
                    <Table.Row key={index}>
                      {this.props.edit ? (
                        <Table.Cell className="text-center">
                          <Button
                            color="teal"
                            onClick={() =>
                              history.push(
                                `/depository/depository-edit/${item.code}/${item.pk}/`
                              )
                            }
                          >
                            <span>ویرایش</span>
                          </Button>
                        </Table.Cell>
                      ) : null}
                      <Table.Cell className="norm-latin text-center">
                        <TableLabel count={9}>
                          <span className="yekan">
                            {item.background_color &&
                              item.background_color.name}
                          </span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center">
                        <TableLabel count={8}>
                          <span className="yekan">
                            {item.design_color && item.design_color.name}
                          </span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center">
                        <TableLabel count={7}>
                          <span className="yekan">
                            {item.material && item.material.name}
                          </span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center">
                        <TableLabel count={6}>
                          <span className="yekan">
                            {item.f_type && item.f_type.name}
                          </span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center">
                        <TableLabel count={5}>
                          <span className="yekan">
                            {item.design && item.design.name}
                          </span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center ltr">
                        <TableLabel count={4}>
                          <span className="yekan">متر</span>
                          <span>&nbsp;</span>
                          <span>{item.stock_amount}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center rtl">
                        <TableLabel count={3}>
                          <span className="yekan">تومان</span>
                          <span>{digitToComma(item.selling_price)}</span>{" "}
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="yekan text-center">
                        <TableLabel count={2}>
                          <span>{item.name}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell
                        className="norm-latin text-center"
                        textAlign="right"
                      >
                        <TableLabel count={1}>
                          <span>{item.code}</span>
                        </TableLabel>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </React.Fragment>
          ) : (
            <NotFound />
          )}

          <Table.Footer fullWidth hidden={this.state.totalPageCount < 2}>
            <Table.Row>
              <Table.HeaderCell
                colSpan="10"
                className="norm-latin"
                style={{ overflow: "scroll", maxWidth: this.state.width / 2 }}
              >
                <Pagination
                  className="norm-latin"
                  defaultActivePage={1}
                  onPageChange={this.changePage}
                  totalPages={this.state.totalPageCount}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        {!this.props.productsList ? <LoadingBar /> : null}
        {this.props.productsList && this.props.productsList.count === 0 ? (
          <NotFound />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    productsList: state.depository.productsList
  };
};

export default connect(mapStateToProps, {
  getProductsList,
  getProductsByCode
})(ProductTable);
