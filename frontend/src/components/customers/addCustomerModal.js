import React, { Component } from "react";
import { Button, Form, Modal, Message } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getClassTypes,
  setNewCustomer
} from "../../actions/CustomersActions";
import { toastr } from "react-redux-toastr";

const INITIAL_STATE = {
  first_name: null,
  last_name: null,
  email: null,
  phone_number: null,
  address: null,
  city: "",
  bitrth_date: null,
  marriage_date: null,
  points: 0,
  class: null,
  class_type_options: [],
  city_options: [],
  first_name_b: false,
  last_name_b: false,
  phone_number_b: false,
  email_b: false,
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
    this.setState(
      {
        [status]: false
      },
      () => {
        this.setState({
          hasError:
            !this.state.first_name_b &&
            !this.state.last_name_b &&
            !this.state.email_b &&
            !this.state.phone_number_b &&
            !this.state.points_b
              ? false
              : true
        });
      }
    );
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
    if (!this.state.phone_number) {
      this.setState({
        phone_number_b: true
      });
      hasError = true;
    }
    if (this.state.phone_number && this.state.phone_number.length !== 11) {
      this.setState({
        phone_number_b: true
      });
      hasError = true;
    }
    if (this.state.email && !email) {
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
        class_type: this.state.class
      };
      this.props.setNewCustomer(prepareData).then(() => {
        this.props.onClose();
        toastr.success("ثبت مشتری جدید", "مشتری جدید با موفقیت ثبت شد");
      });
    }
  };

  selectChange = (_, { name, value }) => {
    this.setState({
      [name]: value
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
          {this.state.hasError ? (
            <Message className="rtl text-right" color="red">
              <p>فیلد های قرمز را تصحیح کنید.</p>
            </Message>
          ) : (
            <Message className="rtl text-right" color="teal">
              <p>
                پر کردن فیلد هایی که با علامت{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>*</span> مشخص
                شده اند الزامی است.
              </p>
            </Message>
          )}
          <Form className="rtl">
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="rtl placeholder-rtl text-right"
                label={
                  <div style={{ marginBottom: "4px", direction: "rtl" }}>
                    <span style={{ fontWeight: "bold", margin: "0 0 4px" }}>
                      نام
                    </span>
                    <span style={{ color: "red", fontWeight: "bold" }}> *</span>
                  </div>
                }
                onChange={e => this.inputChange(e, "first_name")}
                onSelect={() => this.inputSelect("first_name_b")}
                placeholder={
                  this.state.first_name_b ? "وارد کردن نام الزامی است" : "نام"
                }
                error={this.state.first_name_b}
              />
              <Form.Input
                className="rtl placeholder-rtl text-right"
                placeholder={
                  this.state.last_name_b
                    ? "وارد کردن نام خانوادگی الزامی است"
                    : "نام خانوادگی"
                }
                label={
                  <div style={{ marginBottom: "4px", direction: "rtl" }}>
                    <span style={{ fontWeight: "bold", margin: "0 0 4px" }}>
                      نام خانوادگی
                    </span>
                    <span style={{ color: "red", fontWeight: "bold" }}> *</span>
                  </div>
                }
                onChange={e => this.inputChange(e, "last_name")}
                onSelect={() => this.inputSelect("last_name_b")}
                error={this.state.last_name_b}
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl"
                placeholder={
                  this.state.phone_number_b
                    ? "وارد کردن شماره موبایل الزامی است"
                    : "شماره موبایل"
                }
                label={
                  <div style={{ marginBottom: "4px", direction: "rtl" }}>
                    <span style={{ fontWeight: "bold", margin: "0 0 4px" }}>
                      شماره موبایل
                    </span>
                    <span style={{ color: "red", fontWeight: "bold" }}> *</span>
                  </div>
                }
                onChange={e => this.inputChange(e, "phone_number")}
                onSelect={() => this.inputSelect("phone_number_b")}
                error={this.state.phone_number_b}
              />
              <Form.Input
                className="ltr placeholder-rtl"
                label="ایمیل"
                placeholder="آدرس ایمیل"
                onChange={e => this.inputChange(e, "email")}
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="rtl placeholder-rtl text-right"
                label="آدرس"
                onChange={e => this.inputChange(e, "address")}
                placeholder="آدرس محل سکونت"
              />
              <Form.Select
                className="rtl placeholder-rtl text-right"
                placeholder="شهر"
                label="شهر"
                search
                selection
                fluid
                options={this.state.city_options}
                name="city"
                onChange={this.selectChange}
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
                placeholder="امتیاز"
              />
              <Form.Select
                className="rtl placeholder-rtl"
                placeholder="نوع کلاس"
                label="نوع کلاس"
                search
                selection
                options={this.state.class_type_options}
                name="class"
                onChange={this.selectChange}
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
            className="yekan"
          >
            لغو
          </Button>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="افزودن"
            className="yekan"
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
