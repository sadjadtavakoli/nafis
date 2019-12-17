import React from "react";
import { Button, Modal } from "semantic-ui-react";

const DialogModal = props => {
  return (
    <Modal
      id="add-bill"
      closeOnDimmerClick={false}
      dimmer="blurring"
      className="text-right rtl yekan"
      open={props.open}
      onClose={props.onClose}
    >
      <Modal.Header className="yekan">{props.title}</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>{props.children}</Modal.Description>
      </Modal.Content>

      <Modal.Actions>
        <Button
          className="yekan"
          content={props.cancelText || "انصراف"}
          icon="checkmark"
          labelPosition="right"
          onClick={props.onClose}
        />

        <Button
          className="yekan"
          negative
          icon="remove"
          labelPosition="right"
          content={props.submitText || "حذف"}
          onClick={props.onSubmit}
          disabled={props.submitDisable || false}
        />
      </Modal.Actions>
    </Modal>
  );
};
export default DialogModal;
