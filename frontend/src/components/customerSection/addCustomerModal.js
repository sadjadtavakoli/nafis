import React, { Component } from "react";
import { Button, Form, Modal, Message } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getClassTypes,
  setNewCustomer
} from "../../actions/CustomerSectionActions";
import { toastr } from "react-redux-toastr";

const INITIAL_STATE = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  address: null,
  city: null,
  bitrth_date: null,
  marriage_date: null,
  points: null,
  class_type_options: [],
  city_options: [],
  first_name_b: false,
  last_name_b: false,
  email_b: false,
  phone_number_b: false,
  points_b: false,
  hasError: false
};

class AddCustomerModal extends Component {
  state = {
    INITIAL_STATE
  };

  componentDidMount() {
    this.props.getClassTypes().then(() => {
      this.setState({
        class_type_options: this.props.classAndCity.customerTypes,
        city_options: this.props.classAndCity.cities
      });
    });
  }

  inputChange = (event, inputName) => {
    this.setState({
      [inputName]: event.target.value
    });
  };

  inputSelect = status => {
    this.setState({
      [status]: false,
      hasError: false
    });
  };

  validateEmail = email => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  handleSubmit = () => {
    let hasError = false;
    let email = this.validateEmail(this.state.email);
    if (!this.state.first_name) {
      this.setState({
        first_name_b: true
      });
      hasError = true;
    }
    if (!this.state.last_name) {
      this.setState({
        last_name_b: true
      });
      hasError = true;
    }
    if (!this.state.email) {
      this.setState({
        email_b: true
      });
      hasError = true;
    }
    if (this.state.phone_number.length !== 11) {
      this.setState({
        phone_number_b: true
      });
      hasError = true;
    }
    if (!this.state.points) {
      this.setState({
        points_b: true
      });
      hasError = true;
    }
    if (!email) {
      this.setState({
        email_b: true
      });
      hasError = true;
    }
    if (hasError) {
      this.setState({
        hasError: true
      });
    }
    if (!hasError) {
      const prepareData = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        phone_number: this.state.phone_number,
        address: this.state.address,
        city: this.state.city,
        bitrth_date: this.state.bitrth_date,
        marriage_date: this.state.marriage_date,
        points: this.state.points,
        class_type_options: this.state.class_type_options,
        city_options: this.state.city_options
      };
      this.props.setNewCustomer(prepareData).then(() => {
        this.props.onClose();
        toastr.success("ثبت مشتری جدید", "مشتری جدید با موفقیت ثبت شد");
      });
    }
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
          {this.state.hasError ? (
            <Message className="rtl text-right" color="red">
              <p>فیلد های قرمز را تصحیح کنید.</p>
            </Message>
          ) : null}
          <Form className="rtl">
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl text-right"
                label="نام"
                onChange={e => this.inputChange(e, "first_name")}
                onSelect={() => this.inputSelect("first_name_b")}
                placeholder="نام"
                error={this.state.first_name_b}
              />
              <Form.Input
                className="ltr placeholder-rtl text-right"
                placeholder="نام خانوادگی"
                label="نام خانوادگی"
                onChange={e => this.inputChange(e, "last_name")}
                onSelect={() => this.inputSelect("last_name_b")}
                error={this.state.last_name_b}
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl"
                label="ایمیل"
                onChange={e => this.inputChange(e, "email")}
                onSelect={() => this.inputSelect("email_b")}
                placeholder="آدرس ایمیل"
                error={this.state.email_b}
              />
              <Form.Input
                className="rtl placeholder-rtl text-right"
                placeholder="شماره تلفن"
                label="تلفن"
                type="number"
                onChange={e => this.inputChange(e, "phone_number")}
                onSelect={() => this.inputSelect("phone_number_b")}
                error={this.state.phone_number_b}
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl text-right"
                label="آدرس"
                onChange={e => this.inputChange(e, "address")}
                placeholder="آدرس محل سکونت"
              />
              <Form.Select
                className="ltr placeholder-rtl text-right"
                placeholder="شهر"
                label="شهر"
                search
                selection
                fluid
                options={this.state.city_options}
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl"
                label="تاریخ تولد"
                onChange={e => this.inputChange(e, "birth_date")}
                placeholder="تاریخ تولد"
              />
              <Form.Input
                className="ltr placeholder-rtl"
                placeholder="تاریخ ازدواج"
                label="تاریخ ازدواج"
                onChange={e => this.inputChange(e, "marriage_date")}
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="rtl placeholder-rtl text-right"
                type="number"
                label="امتیاز"
                onChange={e => this.inputChange(e, "points")}
                onSelect={() => this.inputSelect("points_b")}
                error={this.state.points_b}
                placeholder="امتیاز"
              />
              <Form.Select
                className="ltr placeholder-rtl"
                placeholder="نوع کلاس"
                label="نوع کلاس"
                search
                selection
                options={this.state.class_type_options}
              />
            </Form.Group>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button
            color="black"
            onClick={() => {
              this.props.onClose();
              this.setState(INITIAL_STATE);
            }}
          >
            لغو
          </Button>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="افزودن"
            onClick={this.handleSubmit}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    classAndCity: state.customers.classTypesAndCity
  };
};

export default connect(mapStateToProps, { getClassTypes, setNewCustomer })(
  AddCustomerModal
);
