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
import {
  getProductsByCode,
  updateProduct,
  getProductFields
} from "../../actions/DepositoryActions";
import { toastr } from "react-redux-toastr";

class depositoryEdit extends Component {
  state = {
    // Initial Values
    code: null,
    pk: null,
    name: null,
    stock_amount: null,
    selling_price: null,
    buying_price: null,
    background_color: "",
    design_color: null,
    material: null,
    f_type: null,
    design: null,
    // Options
    f_type_Options: {},
    design_Options: {},
    material_Options: {},
    background_color_Options: {},
    design_color_Options: {},
    // Booleans
    name_b: false,
    stock_amount_b: false,
    selling_price_b: false,
    buying_price_b: false,
    f_type_Options_b: false,
    design_Options_b: false,
    material_Options_b: false,
    background_color_Options_b: false,
    design_color_Options_b: false
  };

  componentDidMount() {
    this.props.getProductsByCode(this.props.match.params.code).then(() => {
      console.log(this.props.depositoryProduct);
      this.setState({
        code: this.props.match.params.code,
        pk: this.props.match.params.pk,
        name: this.props.depositoryProduct.name,
        stock_amount: this.props.depositoryProduct.stock_amount,
        selling_price: this.props.depositoryProduct.selling_price,
        buying_price: this.props.depositoryProduct.buying_price,
        background_color: this.props.depositoryProduct.background_color.id,
        design_color: this.props.depositoryProduct.design_color.id,
        material: this.props.depositoryProduct.material.id,
        f_type: this.props.depositoryProduct.f_type.id,
        design: this.props.depositoryProduct.design.id
      });
    });
    this.props.getProductFields().then(() => {
      console.log(this.props.productFields);
      this.setState({
        background_color_Options: this.props.productFields.background_color,
        design_color_Options: this.props.productFields.design_color,
        material_Options: this.props.productFields.material,
        design_Options: this.props.productFields.design,
        f_type_Options: this.props.productFields.f_type
      });
    });
  }

  convertStatus_b = status => {
    return status.concat("_b");
  };

  convertStatus_Options = status => {
    return status.concat("_Options");
  };

  handleEdit = status => {
    const convertStatus_b = this.convertStatus_b(status);
    this.setState({
      [convertStatus_b]: true
    });
  };

  handleProductChange = (status, e) => {
    this.setState({
      ...this.state,
      [status]: e.target.value
    });
  };

  selectChange = (_, { status, value }) => {
    this.setState({
      [status]: value
    });
  };

  handleSubmit = status => {
    this.props
      .updateProduct(this.state.pk, {
        [status]: this.state[status]
      })
      .then(res => {
        this.setState({ [status]: res.data[status] });
        toastr.success(".عملیات ویرایش موفقیت آمیز بود");
      })
      .catch(() => {
        toastr.error(
          "عملیات ویرایش موفقیت آمیز نبود. لطفا با تیم پشتیبانی در تماس باشید"
        );
      });
    const convertStatus_b = this.convertStatus_b(status);
    this.setState({
      [convertStatus_b]: false
    });
  };

  getTheValue = status => {
    this.props.getProductsByCode(this.props.match.params.code).then(() => {
      this.setState({
        [status]: this.props.depositoryProduct[status].id
      });
    });
  };

  createInput = (status, title) => {
    const convertStatus_b = this.convertStatus_b(status);
    return (
      <Form.Input
        error={!this.state[convertStatus_b]}
        className={"text-right"}
        label={
          <React.Fragment>
            <span className="us-em-span">{title}</span>
            <Label
              className="pointer"
              size="mini"
              color={`${this.state[convertStatus_b] ? "green" : "teal"}`}
              style={{ marginBottom: "3px", marginRight: "5px" }}
              onClick={() => {
                this.state[convertStatus_b]
                  ? this.handleSubmit(status)
                  : this.handleEdit(status);
              }}
            >
              <Icon
                name={`${this.state[convertStatus_b] ? "checkmark" : "edit"}`}
              />
              {`${this.state[convertStatus_b] ? "اعمال" : "ویرایش"}`}
            </Label>
          </React.Fragment>
        }
        value={this.state[status]}
        readOnly={!this.state[convertStatus_b]}
        onChange={e => this.handleProductChange(status, e)}
      />
    );
  };

  createSelect = (status, title) => {
    const convertStatus_b = this.convertStatus_b(status);
    const convertStatus_Options = this.convertStatus_Options(status);
    if (!this.state[convertStatus_b]) {
      return (
        <Form.Select
          value={this.state[status]}
          error
          fluid
          selection
          search
          disabled
          label={
            <React.Fragment>
              <span className="us-em-span">{title}</span>
              <Label
                className="pointer"
                size="mini"
                color="teal"
                style={{ marginBottom: "3px", marginRight: "5px" }}
                onClick={() => {
                  this.handleEdit(status);
                }}
              >
                <Icon name="edit" />
                ویرایش
              </Label>
            </React.Fragment>
          }
          options={this.props.productFields && this.props.productFields[status]}
        />
      );
    }
    if (this.state[convertStatus_b]) {
      return (
        <Form.Select
          status={status}
          options={this.state[convertStatus_Options]}
          onChange={this.selectChange}
          fluid
          selection
          search
          label={
            <React.Fragment>
              <span className="us-em-span">{title}</span>
              <Label
                className="pointer"
                size="mini"
                color="green"
                style={{ marginBottom: "3px", marginRight: "5px" }}
                onClick={() => {
                  this.handleSubmit(status);
                }}
              >
                <Icon name="checkmark" />
                اعمال
              </Label>
            </React.Fragment>
          }
          placeholder="THIS IS A PLACEHOLDER"
        />
      );
    }
  };

  render() {
    return (
      <Container id="depository-edit" className="rtl text-right">
        <Segment>
          <Header as="h3" block style={{ wordSpacing: "3px" }}>
            ویرایش اطلاعات محصول {this.state.name}
          </Header>
          <Form>
            <Form.Group unstackable widths={2}>
              {this.createInput("name", "نام محصول")}
              {this.createInput("stock_amount", "مقدار باقی مانده")}
            </Form.Group>
            <Form.Group unstackable widths={2}>
              {this.createInput("selling_price", "قیمت فروش")}
              {this.createInput("buying_price", "قیمت خرید")}
            </Form.Group>
            <Form.Group unstackable widths={2}>
              {this.createSelect("background_color", "رنگ پس زمینه")}
              {this.createSelect("design_color", "رنگ طرح")}
            </Form.Group>
            <Form.Group unstackable widths={2}>
              {this.createSelect("material", "جنس")}
              {this.createSelect("f_type", "نوع پارچه")}
            </Form.Group>
            <Form.Group unstackable widths={2}>
              {this.createSelect("design", "نوع طرح")}
            </Form.Group>
          </Form>
        </Segment>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    depositoryProduct: state.depository.productsList,
    productFields: state.depository.productFields
  };
};

export default connect(mapStateToProps, {
  getProductsByCode,
  updateProduct,
  getProductFields
})(depositoryEdit);
