import React from "react";
import { connect } from "react-redux";
import { Button, Container, Segment } from "semantic-ui-react";
import AddProductModal from "./addProductModal";
import ProductTable from "./productTable";
import {
  getProductID,
  getProductsByFilter
} from "../../actions/DepositoryActions";
import FilterSegment from "./filterSegment";
import history from "../../history";

class Depository extends React.Component {
  state = {
    open: false,
    productID: NaN,
    filterOpen: false
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  openModal = () => {
    this.props.getProductID().then(() => {
      this.setState({ productID: this.props.productID.pk }, () => {
        this.setState({ open: true });
      });
    });
  };

  openFilter = status => {
    this.setState({
      filterOpen: status
    });
  };
  getProductsByFilter = filterParams => {
    this.props.getProductsByFilter(filterParams).then(response => {
      console.log("response", response.data);
    });
  };
  render() {
    return (
      <React.Fragment>
        <Container>
          <AddProductModal
            open={this.state.open}
            code={this.state.productID}
            onClose={this.closeModal}
          />
          <div id="depository">
            <Segment stacked className="rtl">
              <Button
                className="yekan"
                onClick={this.openModal}
                color="green"
                content="افزودن محصول جدید"
                icon="add"
                labelPosition="right"
              />
              <Button
                className="yekan"
                onClick={() => this.openFilter(!this.state.filterOpen)}
                color={this.state.filterOpen ? "yellow" : "grey"}
                content="فیلتر"
                icon="filter"
                labelPosition="right"
              />
              <Button
                style={{ float: "left" }}
                onClick={() => history.push("/")}
                color="teal"
                icon="home"
              />
              {this.state.filterOpen ? (
                <FilterSegment submitFilter={this.getProductsByFilter} />
              ) : null}
            </Segment>
            <ProductTable edit={true} />
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    productID: state.depository.productID,
    productsList: state.depository.productsList
  };
};

export default connect(mapStateToProps, { getProductID, getProductsByFilter })(
  Depository
);
