import React, { Component } from "react";
import { Form, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getACustomer,
  updateCustomer
} from "../../actions/CustomerSectionActions";
import { toastr } from "react-redux-toastr";

const INITIAL_STATE = {};

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
    anyChange: false
  };

  componentDidMount() {
    this.props.getACustomer(this.props.passingPk).then(() => {
      this.setState({ pk: this.props.passingPk });
    });
  }

  componentDidUpdate() {
    if (
      this.props.theCustomer &&
      this.state.phone_number !== this.props.theCustomer.phone_number
    ) {
      this.setState({
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
    }
  }

  convertStatus = status => {
    return status.concat("_b");
  };

  handleChange = (status, e) => {
    this.setState({
      [status]: e.target.value,
      anyChange: true
    });
  };

  handleSubmit = status => {
    this.props
      .updateCustomer(this.state.pk, {
        [status]: this.state[status]
      })
      .then(() => {
        this.setState({ [status]: this.state[status] });
        toastr.success(".عملیات ویرایش با موفقیت انجام شد");
      })
      .catch(() => {
        toastr.error(".عملیات ویرایش موفقیت آمیز نبود");
      });
    const convertedStatus = this.convertStatus(status);
    this.setState({
      [convertedStatus]: false
    });
  };

  handleSelect = status => {
    let convert = this.convertStatus(status);
    this.setState({
      [convert]: true
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
    return (
      <Form.Input
        className={`text-right`}
        label={title}
        onChange={e => this.handleChange(status, e)}
        onSelect={() => this.handleSelect(status)}
        onBlur={() => this.handleBlur(status)}
        defaultValue={this.state[convert] ? null : this.state[status]}
        placeholder={this.state[convert] ? this.state[status] : null}
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
            color={this.state.anyChange ? "green" : null}
          >
            اعمال
          </Button>
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
