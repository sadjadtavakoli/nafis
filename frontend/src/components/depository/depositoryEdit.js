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
    code: null,
    pk: null,
    name: null,
    stock_amount: null,
    selling_price: null,
    buying_price: null,
    background_color: null,
    design_color: null,
    material: null,
    f_type: null,
    design: null,
    f_type_Options: {},
    design_Options: {},
    material_Options: {},
    background_color_Options: {},
    design_color_Options: {},
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
      this.setState({
        code: this.props.match.params.code,
        pk: 2,
        name: this.props.depositoryProduct.name,
        stock_amount: this.props.depositoryProduct.stock_amount,
        selling_price: this.props.depositoryProduct.selling_price,
        buying_price: this.props.depositoryProduct.buying_price,
        background_color: this.props.depositoryProduct.background_color.name,
        design_color: this.props.depositoryProduct.design_color.name,
        material: this.props.depositoryProduct.material.name,
        f_type: this.props.depositoryProduct.f_type.name,
        design: this.props.depositoryProduct.design.name
      });
      console.log(this.props.depositoryProduct);
    });
    this.props.getProductFields().then(() => {
      this.setState({
        background_color_Options: this.props.productFields.background_color,
        design_color_Options: this.props.productFields.design_color,
        material_Options: this.props.productFields.material,
        design_Options: this.props.productFields.design,
        f_type_Options: this.props.productFields.f_type
      });
      console.log(this.state.background_color_Options);
    });
  }

  convertStatus = status => {
    return status.concat("_b");
  };

  selectConvertedStatus = status => {
    return status.concat("_Options");
  };

  handleEdit = status => {
    const convertedStatus = this.convertStatus(status);
    this.setState({
      [convertedStatus]: true
    });
  };

  handleProductChange = (status, e) => {
    this.setState(
      {
        ...this.state,
        [status]: e.target.value
      },
      () => {}
    );
  };

  selectChange = (_, { name, value }) => {
    this.setState({
      [name]: value
    });
  };

  handleSubmit = status => {
    this.props
      .updateProduct(this.state.pk, {
        [status]: this.state[status]
      })
      .then(() => {
        toastr.success(".عملیات ویرایش موفقیت آمیز بود");
      })
      .catch(() => {
        toastr.error(
          "عملیات ویرایش موفقیت آمیز نبود. لطفا با تیم پشتیبانی در تماس باشید"
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
        className={"text-right"}
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
                console.log(this.state);
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
        onChange={e => this.handleProductChange(status, e)}
        defaultValue={this.state[status]}
        readOnly={!this.state[convertedStatus]}
      />
    );
  };

  createSelect = (status, title) => {
    const convertedStatus = this.convertStatus(status);
    const selectConvertedStatus = this.selectConvertedStatus(status);
    if (
      this.state.background_color_Options.length &&
      !this.state[convertedStatus]
    ) {
      return (
        <Form.Input
          className={"text-right"}
          error
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
          onChange={e => this.handleProductChange(status, e)}
          defaultValue={this.state[status]}
          readOnly={!this.state[convertedStatus]}
        />
      );
    }
    if (
      this.state.background_color_Options.length &&
      this.state[convertedStatus] === true
    ) {
      return (
        <Form.Select
          fluid
          placeholder={
            this.props.productsList &&
            this.props.depositoryProduct.background_color.name
          }
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
          search
          selection
          onChange={this.selectChange}
          name={status}
          options={this.state[selectConvertedStatus]}
          readOnly={!this.state[convertedStatus]}
        />
      );
    }
  };

  render() {
    return (
      <Container className="rtl text-right">
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
