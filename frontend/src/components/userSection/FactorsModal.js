import React, { Component } from "react";
import { Button, Modal, Segment, Checkbox } from "semantic-ui-react";
import { connect } from "react-redux";
import { getAllBills } from "../../actions/UserSectionActions";

class FactorsModal extends Component {
  state = {};

  handleClick = () =>
    this.setState(prevState => ({
      active: !prevState.active
    }));

  componentDidMount() {}

  componentDidUpdate() {
    if (this.props.passingPk) {
      this.props.getAllBills(this.props.passingPk);
    }
  }

  render() {
    return (
      <div className="rtl text-center">
        <Modal
          dimmer={"blurring"}
          open={this.props.isOpen}
          onClose={this.props.onClose}
        >
          <Modal.Header className="text-right">نمایش فاکتورها</Modal.Header>
          <Modal.Content className="rtl text-center">
            <Segment stacked className="text-right us-fm-segment">
              <Checkbox toggle className="us-fm-toggle" />
              <span className="us-fm-span">نمایش فاکتورهای باقی مانده</span>
              <span>{this.props.passingPk}</span>
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="black" onClick={this.props.onClose}>
              <span>تایید</span>
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    allBills: state.allBills
  };
};
const mapDispathToProps = {
  getAllBills
};

export default connect(mapStateToProps, mapDispathToProps)(FactorsModal);
