import React from "react";
import { Modal } from "semantic-ui-react";
import { getACustomer, updateCustomer } from "../../actions/CustomersActions";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { convertToJalaali } from "../utils/jalaaliUtils";
import EditTab from "../customers/EditTab";

class EditCustomerPopup extends React.Component {
  render() {
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        size="tiny"
        className="rtl text-right"
      >
        <Modal.Header>
          <h3
            className="yekan d-flex"
            style={{ alignItems: "center", marginBottom: 0 }}
          >
            ویرایش مشتری
          </h3>
        </Modal.Header>
        <Modal.Content>
          <EditTab
            fromCashregister={true}
            passingPk={this.props.pk}
            onClose={this.props.onClose}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    theCustomer: state.customers.theCustomer
  };
};

export default connect(mapStateToProps, { getACustomer, updateCustomer })(
  EditCustomerPopup
);
