import React, { Component } from "react";
import { Button, Form, Modal } from "semantic-ui-react";
import { connect } from "react-redux";
import { setNewSupplier } from "../../actions/SuppliersActions";
import { toastr } from "react-redux-toastr";

class Add extends Component {
  state = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    first_name_b: false,
    last_name_b: false,
    email_b: false,
    phone_number_b: false,
    address_b: false
  };

  inputChange = (event, inputName) => {
    this.setState({
      [inputName]: event.target.value
    });
  };

  selectInput = status => {
    let b = status.concat("_b");
    this.setState({ [b]: false });
  };

  handleSubmit = () => {
    let hasError = false;
    if (String(this.state.first_name).length < 1) {
      this.setState({
        first_name_b: true
      });
      hasError = true;
    }
    if (String(this.state.last_name).length < 1) {
      this.setState({
        last_name_b: true
      });
      hasError = true;
    }
    if (String(this.state.email).length < 1) {
      this.setState({
        email_b: true
      });
      hasError = true;
    }
    if (String(this.state.phone_number).length !== 11) {
      this.setState({
        phone_number_b: true
      });
      hasError = true;
    }
    if (String(this.state.address).length < 1) {
      this.setState({
        address_b: true
      });
      hasError = true;
    }
    if (!hasError) {
      let prepareData = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        phone_number: this.state.phone_number,
        address: this.state.address
      };
      this.props.setNewSupplier(prepareData).then(() => {
        this.props.onClose();
        toastr.success(
          "ثبت تامین کننده جدید",
          "تامین کننده جدید با موفقیت ثبت شد"
        );
      });
    }
  };

  handleClose = () => {
    this.setState({
      first_name_b: false,
      last_name_b: false,
      email_b: false,
      phone_number_b: false,
      address_b: false
    });
  };

  createInput = (label, status) => {
    let b = status.concat("_b");
    return (
      <Form.Input
        className={`${
          status === "email" || status === "phone_number"
            ? "ltr text-left norm-latin"
            : "rtl text-right yekan"
        } placeholder-rtl`}
        label={label}
        placeholder={label}
        error={this.state[b]}
        onChange={e => this.inputChange(e, status)}
        onSelect={() => {
          this.selectInput(status);
        }}
      />
    );
  };

  render() {
    return (
      <Modal
        dimmer={"blurring"}
        open={this.props.open}
        onClose={this.props.onClose}
        className="text-right"
      >
        <Modal.Header>افزودن تامین کننده جدید</Modal.Header>

        <Modal.Content>
          <Form className="rtl">
            <Form.Group unstackable widths={2}>
              {this.createInput("نام", "first_name")}
              {this.createInput("نام خانوادگی", "last_name")}
            </Form.Group>
            <Form.Group unstackable widths={2}>
              {this.createInput("ایمیل", "email")}
              {this.createInput("شماره تلفن", "phone_number")}
            </Form.Group>
            <Form.Group unstackable widths={2}>
              {this.createInput("آدرس", "address")}
            </Form.Group>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button
            color="black"
            className="yekan"
            onClick={() => {
              this.props.onClose();
              this.handleClose();
            }}
            content="لغو"
          />
          <Button
            positive
            className="yekan"
            icon="checkmark"
            labelPosition="right"
            content="تایید"
            onClick={this.handleSubmit}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default connect(null, { setNewSupplier })(Add);
