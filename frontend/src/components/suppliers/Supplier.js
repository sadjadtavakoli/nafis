import React, { Component } from "react";
import {
  Form,
  Label,
  Icon,
  Container,
  Segment,
  Header
} from "semantic-ui-react";
import { connect } from "react-redux";
import { getTheSupplier, updateSupplier } from "../../actions/SuppliersActions";
import { toastr } from "react-redux-toastr";

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
    address_b: false
  };

  componentDidMount() {
    this.props.getTheSupplier(this.props.match.params.pk).then(() => {
      this.setState({
        pk: this.props.match.params.pk
      });
    });
  }
  componentDidUpdate() {
    if (
      this.props.supplier &&
      this.state.phone_number !== this.props.supplier.phone_number
    ) {
      this.setState({
        full_name: this.props.supplier.full_name,
        email: this.props.supplier.email,
        phone_number: this.props.supplier.phone_number,
        address: this.props.supplier.address
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
      .updateSupplier(this.state.pk, {
        [status]: this.state[status]
      })
      .then(res => {
        this.setState({ [status]: this.state[status] });
        toastr.success(".عملیات ویرایش موفقیت آمیز بود");
      })
      .catch(() => {
        toastr.error(
          ".عملیات ویرایش موفقیت آمیز نبود. لطفا با تیم پشتیبانی در تماس باشید"
        );
      });
    const convertedStatus = this.convertStatus(status);
    this.setState({
      [convertedStatus]: false
    });
  };

  createInput = (status, title) => {
    const convertedStatus = this.convertStatus(status);
    return (
      <Form.Input
        className={`text-right`}
        error={!this.state[convertedStatus]}
        label={
          <React.Fragment>
            <span className="us-em-span">{title}</span>
            <Label
              className="pointer"
              size="mini"
              color={`${this.state[convertedStatus] ? "green" : "teal"}`}
              style={{ marginBottom: "3px", marginRight: "5px" }}
              onClick={() => {
                this.state[convertedStatus]
                  ? this.handleSubmit(status)
                  : this.handleEdit(status);
              }}
            >
              <Icon
                name={`${this.state[convertedStatus] ? "checkmark" : "edit"}`}
              />
              {`${this.state[convertedStatus] ? "اعمال" : "ویرایش"}`}
            </Label>
          </React.Fragment>
        }
        onChange={e => this.handleEditChange(status, e)}
        defaultValue={this.state[status]}
        readOnly={!this.state[convertedStatus]}
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
