import React, { Component } from "react";
import { Button, Form, Label, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getACustomer,
  updateCustomer
} from "../../actions/CustomerSectionActions";

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
    class_type_b: false
  };

  componentDidMount() {
    this.props.getACustomer(this.props.passingPk);
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

  handleEdit = status => {
    const convertedStatus = this.convertStatus(status);
    this.setState({
      [convertedStatus]: true
    });
  };

  handleEditChange = (status, e) => {
    this.setState({
      [status]: e.target.value
    });
  };

  handleSubmit = status => {
    this.props
      .updateCustomer(this.state.pk, {
        [status]: this.state[status]
      })
      .then(res => {
        this.setState({ [status]: this.state[status] });
      });
    const convertedStatus = this.convertStatus(status);
    this.setState({
      [convertedStatus]: false
    });
  };

  createInput = (status, title) => {
    const convertedStatus = this.convertStatus(status);
    if (this.state[convertedStatus] === false) {
      return (
        <Form.Input
          className="text-right error"
          label={
            <React.Fragment>
              <span className="us-em-span">{title}</span>
              <Label
                className="pointer"
                size="mini"
                color="teal"
                style={{ marginBottom: "3px", marginRight: "5px" }}
                onClick={() => this.handleEdit(status)}
              >
                <Icon name="edit" /> ویرایش
              </Label>
            </React.Fragment>
          }
          value={this.state[status]}
          readOnly
        />
      );
    }
    if (this.state[convertedStatus] === true) {
      return (
        <Form.Input
          className="text-right"
          label={
            <React.Fragment>
              <span className="us-em-span">{title}</span>
              <Label
                className="pointer"
                size="mini"
                color="green"
                style={{ marginBottom: "3px", marginRight: "5px" }}
                onClick={() => this.handleSubmit(status)}
              >
                <Icon name="edit" /> اعمال
              </Label>
            </React.Fragment>
          }
          onChange={e => this.handleEditChange(status, e)}
        />
      );
    }
  };

  createCloseButton = () => {
    if (
      this.state.first_name_b === false &&
      this.state.last_name_b === false &&
      this.state.email_b === false &&
      this.state.phone_number_b === false &&
      this.state.address_b === false &&
      this.state.birth_date_b === false &&
      this.state.marriage_date_b === false &&
      this.state.points_b === false
    ) {
      return (
        <Button color="black" onClick={this.props.onClose}>
          <span>بستن</span>
        </Button>
      );
    } else {
      return (
        <Button color="black" disabled>
          <span>بستن</span>
        </Button>
      );
    }
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
            {this.createInput("points", "امتیازات")}
          </Form.Group>
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
