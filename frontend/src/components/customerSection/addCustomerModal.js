import React, { Component } from "react";
import { Button, Form, Modal } from "semantic-ui-react";

class AddCustomerModal extends Component {
  state = {
    first_name: null,
    last_name: null,
    email: null,
    phone_number: null,
    address: null,
    city: null,
    bitrth_date: null,
    marriage_date: null,
    points: null,
    formValidation: {
      first_name: false,
      last_name: false,
      email: false,
      phone_number: false,
      address: false,
      city: false,
      bitrth_date: false,
      marriage_date: false,
      points: false
    }
  };

  inputChange = (event, inputName) => {
    this.setState({
      [inputName]: event.target.value
    });
  };

  render() {
    return (
      <Modal
        dimmer={"blurring"}
        open={this.props.open}
        onClose={this.props.onClose}
        className="text-right"
      >
        <Modal.Header>افزودن مشتری جدید</Modal.Header>

        <Modal.Content>
          <Form className="rtl">
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl text-right"
                label="نام"
                error={this.state.formValidation.first_name}
                onChange={e => this.inputChange(e, "first_name")}
                placeholder="نام"
              />
              <Form.Input
                className="ltr placeholder-rtl text-right"
                placeholder="نام خانوادگی"
                label="نام خانوادگی"
                error={this.state.formValidation.last_name}
                onChange={e => this.inputChange(e, "last_name")}
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl"
                label="ایمیل"
                error={this.state.formValidation.email}
                onChange={e => this.inputChange(e, "email")}
                placeholder="آدرس ایمیل"
              />
              <Form.Input
                className="rtl placeholder-rtl text-right"
                placeholder="شماره تلفن"
                label="تلفن"
                type="number"
                error={this.state.formValidation.phone_number}
                onChange={e => this.inputChange(e, "phone_number")}
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl text-right"
                label="آدرس"
                error={this.state.formValidation.address}
                onChange={e => this.inputChange(e, "address")}
                placeholder="آدرس"
              />
              <Form.Input
                className="ltr placeholder-rtl text-right"
                placeholder="شهر"
                label="شهر"
                error={this.state.formValidation.city}
                onChange={e => this.inputChange(e, "city")}
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl"
                label="تاریخ تولد"
                error={this.state.formValidation.bitrth_date}
                onChange={e => this.inputChange(e, "birth_date")}
                placeholder="مثل 15/2/1398"
              />
              <Form.Input
                className="ltr placeholder-rtl"
                placeholder="تاریخ ازدواج"
                label="تاریخ ازدواج"
                error={this.state.formValidation.marriage_date}
                onChange={e => this.inputChange(e, "marriage_date")}
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="rtl placeholder-rtl text-right"
                type="number"
                label="امتیاز"
                error={this.state.formValidation.points}
                onChange={e => this.inputChange(e, "points")}
                placeholder="امتیاز"
              />
              <Form.Input
                className="ltr placeholder-rtl"
                placeholder="نوع"
                label="نوع"
                error={this.state.formValidation.class_type}
                onChange={e => this.inputChange(e, "class_type")}
              />
            </Form.Group>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button color="black" onClick={this.props.onClose}>
            لغو
          </Button>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="تایید"
            onClick={this.props.onClose}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default AddCustomerModal;
