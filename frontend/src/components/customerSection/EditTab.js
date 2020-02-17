import React, { Component } from "react";
import { Form, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getACustomer,
  updateCustomer
} from "../../actions/CustomerSectionActions";
import { toastr } from "react-redux-toastr";
import history from "../../history";

class EditTab extends Component {
  state = {
    pk: null,
    first_name: null,
    last_name: null,
    email: null,
    phone_number: null,
    address: null,
    birth_date: null,
    marriage_date: null,
    points: null,
    class_type: null,
    first_name_b: false,
    last_name_b: false,
    email_b: false,
    phone_number_b: false,
    address_b: false,
    birth_date_b: false,
    marriage_date_b: false,
    points_b: false,
    class_type_b: false,
    first_name_e: false,
    last_name_e: false,
    email_e: false,
    phone_number_e: false,
    address_e: false,
    birth_date_e: false,
    marriage_date_e: false,
    points_e: false,
    class_type_e: false,
    anyChange: false
  };

  componentDidMount() {
    this.getCustomerInfo();
  }

  getCustomerInfo = () => {
    this.props.getACustomer(this.props.passingPk).then(() => {
      this.setState({
        pk: this.props.passingPk,
        first_name: this.props.theCustomer.first_name,
        last_name: this.props.theCustomer.last_name,
        email: this.props.theCustomer.email,
        phone_number: this.props.theCustomer.phone_number,
        address: this.props.theCustomer.address,
        birth_date: this.props.theCustomer.birth_date,
        marriage_date: this.props.theCustomer.marriage_date,
        points: this.props.theCustomer.points,
        class_type: this.props.theCustomer.class_type
      });
    });
  };

  convertStatus = status => {
    return status.concat("_b");
  };

  convertStatusE = status => {
    return status.concat("_e");
  };

  handleChange = (status, e) => {
    this.setState({
      [status]: e.target.value,
      anyChange: true
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
        first_name_e: true
      });
      hasError = true;
    }
    if (!this.state.last_name) {
      this.setState({
        last_name_e: true
      });
      hasError = true;
    }
    if (!this.state.email) {
      this.setState({
        email_e: true
      });
      hasError = true;
    }
    if (this.state.phone_number.length !== 11) {
      this.setState({
        phone_number_e: true
      });
      hasError = true;
    }
    if (!this.state.points) {
      this.setState({
        points_e: true
      });
      hasError = true;
    }
    if (!email) {
      this.setState({
        email_e: true
      });
      hasError = true;
    }
    if (hasError) {
      this.setState({
        hasError: true
      });
    }
    if (!hasError) {
      let prepareData = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        phone_number: this.state.phone_number,
        address: this.state.address,
        birth_date: this.state.birth_date,
        marriage_date: this.state.marriage_date,
        points: this.state.points,
        class_type: this.state.class_type
      };
      this.props
        .updateCustomer(this.state.pk, prepareData)
        .then(() => {
          toastr.success(".عملیات ویرایش با موفقیت انجام شد");
          this.getCustomerInfo();
        })
        .catch(() => {
          toastr.error(".عملیات ویرایش موفقیت آمیز نبود");
        });
    }
  };

  handleSelect = status => {
    let convert = this.convertStatus(status);
    let convertE = this.convertStatusE(status);
    this.setState({
      [convert]: true,
      [convertE]: false,
      hasError: false
    });
  };

  handleBlur = status => {
    let convert = this.convertStatus(status);
    this.setState({
      [convert]: false
    });
  };

  createInput = (status, title) => {
    let convert = this.convertStatus(status);
    let convertE = this.convertStatusE(status);
    return (
      <Form.Input
        className={`text-right`}
        label={title}
        onChange={e => this.handleChange(status, e)}
        onSelect={() => this.handleSelect(status)}
        onBlur={() => this.handleBlur(status)}
        defaultValue={this.state[convert] ? null : this.state[status]}
        placeholder={this.state[convert] ? this.state[status] : null}
        error={this.state[convertE]}
      />
    );
  };

  render() {
    return (
      <div className="rtl text-right">
        <Form>
          <Form.Group unstackable widths={2}>
            {this.createInput("first_name", "نام")}
            {this.createInput("last_name", "نام خانوداگی")}
          </Form.Group>
          <Form.Group unstackable widths={2}>
            {this.createInput("email", "ایمیل")}
            {this.createInput("phone_number", "شماره تلفن")}
          </Form.Group>
          <Form.Group unstackable widths={2}>
            {this.createInput("address", "آدرس")}
            {this.createInput("birth_date", "تاریخ تولد")}
          </Form.Group>
          <Form.Group unstackable widths={2}>
            {this.createInput("marriage_date", "تاریخ ازدواج")}
            {this.createInput("points", "امتیاز مشتری")}
          </Form.Group>
          <Button
            onClick={this.handleSubmit}
            disabled={this.state.anyChange ? false : true}
            color={this.state.hasError ? "red" : "green"}
            content="اعمال"
            className="yekan"
          />
          <Button
            className="yekan"
            content="بازگشت"
            onClick={() => {
              history.push("/customers/");
            }}
          />
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    theCustomer: state.customers.theCustomer
  };
};

export default connect(mapStateToProps, { getACustomer, updateCustomer })(
  EditTab
);
