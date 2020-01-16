import React, { Component } from "react";
import {
  Button,
  Form,
  Label,
  Icon,
  Container,
  Segment,
  Header
} from "semantic-ui-react";
import { connect } from "react-redux";
import { getTheSupplier, updateSupplier } from "../../actions/SuppliersActions";

class Edit extends Component {
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
      this.setState(
        {
          pk: this.props.match.params.pk
        },
        () => {
          console.log(this.state.pk);
        }
      );
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
  Edit
);
