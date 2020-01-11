import React, { Component } from "react";
import { Button, Modal, Segment, Checkbox } from "semantic-ui-react";
import { connect } from "react-redux";
import { getAllBills } from "../../actions/UserSectionActions";

const INITIAL_STATE = {
  pk: null
};

class FactorsModal extends Component {
  state = INITIAL_STATE;
  handleClick = () =>
    this.setState(prevState => ({
      active: !prevState.active
    }));

  componentDidUpdate() {
    if (this.state.pk !== this.props.passingPk) {
      this.props.getAllBills(this.props.passingPk);
      this.setState({
        pk: this.props.passingPk
      });
    }
    console.log("state pk", this.state.pk);
    console.log("all bills", this.props.allBills);
  }
  onClose = () => {
    this.props.onClose();
    this.setState(INITIAL_STATE);
  };
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
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="black" onClick={this.onClose}>
              <span>تایید</span>
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log("state", state.customers.allBills);
  return {
    allBills: state.customers.allBills
  };
};

export default connect(mapStateToProps, { getAllBills })(FactorsModal);
