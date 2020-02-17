import React, { Component } from "react";
import { Form, Button, Container, Segment, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import { getTheSupplier, updateSupplier } from "../../actions/SuppliersActions";
import { toastr } from "react-redux-toastr";
import history from "../../history";

class SupplierEdit extends Component {
  state = {
    pk: null,
    full_name: null,
    email: null,
    phone_number: null,
    address: null,
    full_name_b: false,
    email_b: false,
    phone_number_b: false,
    address_b: false,
    hasErrors: false,
    hasChanged: false
  };

  componentDidMount() {
    this.props.getTheSupplier(this.props.match.params.pk).then(() => {
      this.setState({
        pk: this.props.match.params.pk,
        full_name: this.props.supplier.full_name,
        email: this.props.supplier.email,
        phone_number: this.props.supplier.phone_number,
        address: this.props.supplier.address
      });
    });
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
      [status]: e.target.value,
      hasChanged: true
    });
  };

  handleSubmit = () => {
    if (!this.state.full_name) {
      this.setState({
        full_name_b: true,
        hasErrors: true
      });
    }
    if (!this.state.email) {
      this.setState({
        email_b: true,
        hasErrors: true
      });
    }
    if (!this.state.phone_number) {
      this.setState({
        phone_number_b: true,
        hasErrors: true
      });
    }
    if (!this.state.address) {
      this.setState({
        address_b: true,
        hasErrors: true
      });
    }
    if (!this.state.hasErrors) {
      let prepareData = {
        full_name: this.state.full_name,
        email: this.state.email,
        phone_number: this.state.phone_number,
        address: this.state.address
      };
      this.props
        .updateSupplier(this.state.pk, prepareData)
        .then(() => {
          toastr.success(".عملیات ویرایش موفقیت آمیز بود");
        })
        .catch(() => {
          toastr.error(
            ".عملیات ویرایش موفقیت آمیز نبود. لطفا با تیم پشتیبانی در تماس باشید"
          );
        });
      this.setState({
        hasChanged: false
      });
    }
  };

  createInput = (status, title) => {
    return (
      <Form.Input
        className={`text-right`}
        label={<span className="us-em-span">{title}</span>}
        onChange={e => this.handleEditChange(status, e)}
        defaultValue={this.state[status]}
        error={this.state.hasErrors}
      />
    );
  };

  render() {
    return (
      <Container className="rtl text-right">
        <Segment>
          <Header as="h3" block style={{ wordSpacing: "3px" }}>
            نمایش و ویرایش اطلاعات تامین کننده {this.state.full_name}
          </Header>
          <Form>
            <Form.Group unstackable widths={2}>
              {this.createInput("full_name", "نام تامین کننده")}
              {this.createInput("email", "ایمیل")}
            </Form.Group>
            <Form.Group unstackable widths={2}>
              {this.createInput("phone_number", "شماره تلفن")}
              {this.createInput("address", "آدرس")}
            </Form.Group>
            <Button
              className="yekan"
              content="اعمال"
              color="green"
              onClick={this.handleSubmit}
              disabled={
                this.state.hasChanged && !this.state.hasErrors ? false : true
              }
            />
            <Button
              className="yekan"
              content="بازگشت"
              onClick={() => {
                history.push("/suppliers/");
              }}
            />
          </Form>
        </Segment>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    supplier: state.suppliers.supplier
  };
};

export default connect(mapStateToProps, { getTheSupplier, updateSupplier })(
  SupplierEdit
);
