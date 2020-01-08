import React, { Component } from "react";
import { Button, Modal, Segment } from "semantic-ui-react";

class ChequeModal extends Component {
  state = {};
  handleClick = () =>
    this.setState(prevState => ({
      active: !prevState.active
    }));
  render() {
    return (
      <div className="rtl text-center">
        <Modal
          dimmer={"blurring"}
          open={this.props.isOpen}
          onClose={this.props.onClose}
        >
          <Modal.Header className="text-right">نمایش چک‌ها</Modal.Header>
          <Modal.Content className="rtl text-center">
            <Segment stacked className="text-right">
              <Button
                toggle
                active={this.state.active}
                onClick={this.handleClick}
              >
                <span>نمایش چک های باقی مانده</span>
              </Button>
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="black" onClick={this.props.onClose}>
              <span>باشه</span>
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default ChequeModal;
