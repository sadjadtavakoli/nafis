import React, { Component } from "react";
import { Button, Form, Modal } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getClassTypes,
  setNewCustomer
} from "../../actions/CustomerSectionActions";
import { toastr } from "react-redux-toastr";

class AddCustomerModal extends Component {
  state = {
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
    phone_number_b: false
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
          <Form className="rtl">
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl text-right"
                label="نام"
                onChange={e => this.inputChange(e, "first_name")}
                placeholder="نام"
                error={this.state.first_name_b}
              />
              <Form.Input
                className="ltr placeholder-rtl text-right"
                placeholder="نام خانوادگی"
                label="نام خانوادگی"
                onChange={e => this.inputChange(e, "last_name")}
                error={this.state.last_name_b}
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl"
                label="ایمیل"
                onChange={e => this.inputChange(e, "email")}
                placeholder="آدرس ایمیل"
                error={this.state.email_b}
              />
              <Form.Input
                className="rtl placeholder-rtl text-right"
                placeholder="شماره تلفن"
                label="تلفن"
                type="number"
                onChange={e => this.inputChange(e, "phone_number")}
                error={this.state.phone_number_b}
              />
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Input
                className="ltr placeholder-rtl text-right"
                label="آدرس"
                onChange={e => this.inputChange(e, "address")}
                placeholder="آدرس"
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
                placeholder="مثل 15/2/1398"
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
                className="ltr placeholder-rtl"
                placeholder="نوع"
                label="نوع"
                search
                selection
                fluid
                options={this.state.class_type_options}
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
