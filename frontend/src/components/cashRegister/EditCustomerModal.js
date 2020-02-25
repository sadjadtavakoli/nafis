import React from "react";
import { Modal, Button, Input } from "semantic-ui-react";
import {
  getACustomer,
  updateCustomer
} from "../../actions/CustomerSectionActions";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { convertToJalaali } from "../utils/jalaaliUtils";

class EditCustomerPopup extends React.Component {
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
    first_name_b: false,
    last_name_b: false,
    email_b: false,
    phone_number_b: false,
    address_b: false,
    birth_date_b: false,
    marriage_date_b: false,
    points_b: false,
    first_name_e: false,
    last_name_e: false,
    email_e: false,
    phone_number_e: false,
    address_e: false,
    birth_date_e: false,
    marriage_date_e: false,
    points_e: false,
    anyChange: false
  };

  componentDidMount() {
    this.getCustomerInfo();
  }

  getCustomerInfo = () => {
    this.props.getACustomer(this.props.pk).then(() => {
      this.setState({
        pk: this.props.passingPk,
        first_name: this.props.theCustomer.first_name,
        last_name: this.props.theCustomer.last_name,
        email: this.props.theCustomer.email,
        phone_number: this.props.theCustomer.phone_number,
        address: this.props.theCustomer.address,
        birth_date: this.props.theCustomer.birth_date,
        marriage_date: this.props.theCustomer.marriage_date,
        points: this.props.theCustomer.points
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
        points: this.state.points
      };
      this.props
        .updateCustomer(this.props.pk, prepareData)
        .then(() => {
          toastr.success(".عملیات ویرایش با موفقیت انجام شد");
          this.getCustomerInfo();
          this.props.madeChange();
          this.props.onClose();
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

  createInput = status => {
    let convert = this.convertStatus(status);
    let convertE = this.convertStatusE(status);
    return (
      <Input
        fluid
        id={
          status === "first_name" ||
          status === "last_name" ||
          status === "address"
            ? "customer"
            : "customer-latin"
        }
        onChange={e => this.handleChange(status, e)}
        onSelect={() => this.handleSelect(status)}
        onBlur={() => this.handleBlur(status)}
        defaultValue={
          this.state[convert]
            ? null
            : status === "birth_date" || status === "marriage_date"
            ? convertToJalaali(this.state[status])
            : this.state[status]
        }
        placeholder={
          this.state[convert]
            ? status === "birth_date" || status === "marriage_date"
              ? convertToJalaali(this.state[status])
              : this.state[status]
            : null
        }
        error={this.state[convertE]}
        readOnly={
          status === "phone_number" || status === "points"
            ? localStorage.getItem("type") === "cashier"
              ? true
              : false
            : false
        }
      />
    );
  };

  render() {
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        size="tiny"
        className="rtl text-right"
      >
        <Modal.Header>
          <h3
            className="yekan d-flex"
            style={{ alignItems: "center", marginBottom: 0 }}
          >
            ویرایش مشتری
          </h3>
        </Modal.Header>
        <Modal.Content>
          <h5 className="yekan">نام</h5>
          {this.createInput("first_name")}
          <h5 className="yekan">نام خانوادگی</h5>
          {this.createInput("last_name")}
          <h5 className="yekan">ایمیل</h5>
          {this.createInput("email")}
          <h5 className="yekan">شماره تلفن</h5>
          {this.createInput("phone_number")}
          <h5 className="yekan">آدرس</h5>
          {this.createInput("address")}
          <h5 className="yekan">تاریخ تولد</h5>
          {this.createInput("birth_date")}
          <h5 className="yekan">تاریخ ازدواج</h5>
          {this.createInput("marriage_date")}
          <h5 className="yekan">امتیاز مشتری</h5>
          {this.createInput("points")}
        </Modal.Content>
        <Modal.Actions className="ltr text-center">
          <Button.Group>
            <Button className="yekan" onClick={this.props.onClose}>
              بستن
            </Button>
            <Button.Or text="یا" className="yekan" />
            <Button className="yekan" positive onClick={this.handleSubmit}>
              ویرایش
            </Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    theCustomer: state.customers.theCustomer
  };
};

export default connect(mapStateToProps, { getACustomer, updateCustomer })(
  EditCustomerPopup
);
