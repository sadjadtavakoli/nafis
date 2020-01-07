import React from "react";
import { connect } from "react-redux";
import { Button, Container, Segment } from "semantic-ui-react";
import AddProductModal from "./addProductModal";
import ProductTable from "./productTable";
import { getProductID } from "../../actions/DepositoryActions";

class Depository extends React.Component {
  state = {
    open: false,
    productID: NaN
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
            </Segment>
            <ProductTable />
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  // console.log('ppppppppp',state)
  return {
    productID: state.depository.productID
  };
};

export default connect(mapStateToProps, { getProductID })(Depository);
