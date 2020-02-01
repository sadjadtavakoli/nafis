import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Modal, Button } from "semantic-ui-react";
import { addCustomer } from "../../actions/CustomerSectionActions";

class AddCustomerModal extends Component {
  state = {
    first_name: null,
    last_name: null,
    email: null,
    phone_number: null,
    address: null,
    birth_date: null,
    marriage_date: null,
    points: null
  };

  inputChange = (e, inputName) => {
    this.setState({
      [inputName]: e.target.value
    });
    console.log("first", this.state.first_name);
    console.log("last", this.state.last_name);
  };

  addCustomer = () => {
    this.props.addCustomer();
  };

  render() {
    return (
      <Modal
        dimmer={"blurring"}
        open={this.props.open}
        onClose={this.props.onClose}
        className="text-right rtl"
      >
        <Modal.Header>افزودن مشتری جدید</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="rtl placeholder-rtl text-right"
                label="نام"
                onChange={e => this.inputChange(e, "first_name")}
                placeholder="نام"
              />
              <Form.Input
                className="rtl placeholder-rtl text-right"
                label="نام خانوداگی"
                onChange={e => this.inputChange(e, "last_name")}
                placeholder="نام خانوادگی"
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl"
                label="ایمیل"
                onChange={e => this.inputChange(e, "email")}
                placeholder="آدرس ایمیل"
              />
              <Form.Input
                className="ltr placeholder-rtl"
                label="تلفن"
                onChange={e => this.inputChange(e, "phone_number")}
                placeholder="شماره تلفن"
              />
            </Form.Group>
            <Form.Field>
              <Form.Input
                className="rtl placeholder-rtl text-right"
                label="آدرس"
                onChange={e => this.inputChange(e, "address")}
                placeholder="آدرس محل سکونت"
              />
            </Form.Field>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl"
                label="تاریخ تولد"
                onChange={e => this.inputChange(e, "birth_date")}
                placeholder="تاریخ تولد"
              />
              <Form.Input
                className="ltr placeholder-rtl"
                label="تاریخ ازدواج"
                onChange={e => this.inputChange(e, "marriage_date")}
                placeholder="تاریخ ازدواج"
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl"
                label="امتیاز"
                type="number"
                onChange={e => this.inputChange(e, "points")}
              />
              <Form.Select
                fluid
                search
                selection
                className="ltr placeholder-rtl"
                label="نوع کلاس"
                onChange={e => this.inputChange(e, "marriage_date")}
                placeholder="نوع کلاس"
                options={this.state.class_type_options}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="افزودن"
            className="yekan"
            onClick={this.addCustomer}
          />
          <Button
            color="black"
            onClick={this.props.onClose}
            content="لغو"
            className="yekan"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default connect(null, { addCustomer })(AddCustomerModal);
