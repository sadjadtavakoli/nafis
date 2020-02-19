import React from "react";
import { connect } from "react-redux";
import {
  Table,
  Pagination,
  Grid,
  Search,
  Button,
  Icon
} from "semantic-ui-react";
import {
  getProductsList,
  getProductsByCode
} from "../../actions/DepositoryActions";
import { digitToComma } from "../utils/numberUtils";
import LoadingBar from "../utils/loadingBar";
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
            this.setState({ notFound: true });
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
      />
    );
  };

  render() {
    return (
      <div>
        {this.state.productsList.length > 0 ? (
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="10" className="rtl text-right">
                  <Grid>
                    <Grid.Column
                      width={this.state.width < 768 ? 16 : 3}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 0
                      }}
                    >
                      <span>لیست محصولات موجود</span>
                      <Button
                        icon
                        onClick={() =>
                          this.getProductsList(this.state.activePage)
                        }
                      >
                        <Icon name="repeat" />
                      </Button>
                    </Grid.Column>
                    <Grid.Column width={this.state.width < 768 ? 16 : 6}>
                      {this.searchBar()}
                    </Grid.Column>
                  </Grid>
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell className="text-center">
                  عملیات
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  رنگ پس زمینه
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  رنگ طرح
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">جنس</Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  نوع پارچه
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  نوع طرح
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  مقدار باقی مانده
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  قیمت فروش
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  نام محصول
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  کد محصول
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.state.productsList.map((item, index) => {
                return (
                  <Table.Row key={index}>
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
                    <Table.Cell className="norm-latin text-center">
                      <span className="yekan">
                        {item.background_color && item.background_color.name}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin text-center">
                      <span className="yekan">
                        {item.design_color && item.design_color.name}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin text-center">
                      <span className="yekan">
                        {item.material && item.material.name}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin text-center">
                      <span className="yekan">
                        {item.f_type && item.f_type.name}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin text-center">
                      <span className="yekan">
                        {item.design && item.design.name}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin text-center ltr">
                      <span className="yekan">متر</span>
                      <span>&nbsp;</span>
                      <span>{item.stock_amount}</span>
                    </Table.Cell>
                    <Table.Cell className="norm-latin text-center rtl">
                      <span>{digitToComma(item.selling_price)}</span>{" "}
                      <span className="yekan">تومان</span>
                    </Table.Cell>
                    <Table.Cell className="yekan text-center">
                      <span>{item.name}</span>
                    </Table.Cell>
                    <Table.Cell
                      className="norm-latin text-center"
                      textAlign="right"
                    >
                      <span>{item.code}</span>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>

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
        ) : null}
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
