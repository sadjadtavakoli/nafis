import React, { Component } from "react";
import {
  Form,
  Container,
  Segment,
  Header,
  Button,
  Message
} from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getProductsByCode,
  updateProduct,
  getProductFields
} from "../../actions/DepositoryActions";
import { toastr } from "react-redux-toastr";
import history from "../../history";

class DepositoryEdit extends Component {
  state = {
    code: null,
    pk: null,
    // Initial Values
    name: null,
    stock_amount: null,
    selling_price: null,
    buying_price: null,
    background_color: null,
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
    boolean: {
      name: false,
      stock_amount: false,
      selling_price: false,
      buying_price: false,
      background_color: false,
      design_color: false,
      material: false,
      f_type: false,
      design: false
    },
    // Changes
    changed: false,
    isEmpty: false
  };

  componentDidMount() {
    this.props.getProductsByCode(this.props.match.params.code).then(() => {
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
      this.setState({
        background_color_Options: this.props.productFields.background_color,
        design_color_Options: this.props.productFields.design_color,
        material_Options: this.props.productFields.material,
        design_Options: this.props.productFields.design,
        f_type_Options: this.props.productFields.f_type
      });
    });
  }

  convertStatus_Options = status => {
    return status.concat("_Options");
  };

  handleProductChange = (status, e) => {
    this.setState({
      ...this.state,
      [status]: e.target.value,
      changed: true
    });
  };

  selectChange = (_, { status, value }) => {
    this.setState({
      [status]: value,
      changed: true
    });
  };

  handleSubmit = () => {
    let isEmpty = false;
    if (
      !this.state.name ||
      !this.state.stock_amount ||
      !this.state.selling_price ||
      !this.state.buying_price ||
      !this.state.background_color ||
      !this.state.design_color ||
      !this.state.material ||
      !this.state.f_type ||
      !this.state.design
    ) {
      isEmpty = true;
    }
    if (isEmpty) {
      this.setState({ isEmpty: true });
    } else {
      let prepareData = {
        name: this.state.name,
        stock_amount: this.state.stock_amount,
        selling_price: this.state.selling_price,
        buying_price: this.state.buying_price,
        background_color: this.state.background_color,
        design_color: this.state.design_color,
        material: this.state.material,
        f_type: this.state.f_type,
        design: this.state.design
      };
      this.props
        .updateProduct(this.state.pk, prepareData)
        .then(() => {
          toastr.success(".عملیات ویرایش موفقیت آمیز بود");
        })
        .catch(() => {
          toastr.error(
            "عملیات ویرایش موفقیت آمیز نبود. لطفا با تیم پشتیبانی در تماس باشید"
          );
        });
    }
  };

  handleSelect = status => {
    this.setState({
      boolean: {
        [status]: true
      }
    });
  };

  handleBlur = status => {
    this.setState({
      boolean: {
        [status]: false
      }
    });
  };

  createInput = (status, title) => {
    return (
      <Form.Input
        className={"text-right"}
        style={{ "margin-top": "5px" }}
        label={<span className="us-em-span">{title}</span>}
        defaultValue={!this.state.boolean[status] ? this.state[status] : null}
        placeholder={this.state.boolean[status] ? this.state[status] : null}
        onChange={e => this.handleProductChange(status, e)}
        onSelect={() => this.handleSelect(status)}
        onBlur={() => this.handleBlur(status)}
      />
    );
  };

  createSelect = (status, title) => {
    return (
      <Form.Select
        style={{ "margin-top": "5px" }}
        value={this.state[status]}
        fluid
        selection
        search
        label={<span className="us-em-span">{title}</span>}
        options={this.props.productFields && this.props.productFields[status]}
        onChange={e => this.handleProductChange(status, e)}
        onSelect={() => this.handleSelect(status)}
        onBlur={() => this.handleBlur(status)}
      />
    );
  };

  render() {
    return (
      <Container id="depository-edit" className="rtl text-right">
        <Segment>
          <Header as="h3" block style={{ wordSpacing: "3px" }}>
            ویرایش اطلاعات محصول {this.state.name}
          </Header>
          {this.state.isEmpty ? (
            <Message color="red">
              <p>فیلد ها نمیتوانند خالی باشند.</p>
            </Message>
          ) : null}
          <Form>
            <Form.Group unstackable widths="equal">
              {this.createInput("name", "نام محصول")}
              {this.createInput("stock_amount", "مقدار باقی مانده")}
              {this.createInput("selling_price", "قیمت فروش")}
            </Form.Group>
            <Form.Group unstackable widths="equal">
              {this.createInput("buying_price", "قیمت خرید")}
              {this.createSelect("background_color", "رنگ پس زمینه")}
              {this.createSelect("design_color", "رنگ طرح")}
            </Form.Group>
            <Form.Group unstackable widths="equal">
              {this.createSelect("material", "جنس")}
              {this.createSelect("f_type", "نوع پارچه")}
              {this.createSelect("design", "نوع طرح")}
            </Form.Group>
            <Button
              color="green"
              disabled={!this.state.changed ? true : false}
              onClick={this.handleSubmit}
            >
              <span>اعمال</span>
            </Button>
            <Button onClick={() => history.push(`/depository/`)}>
              <span>بازگشت</span>
            </Button>
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
})(DepositoryEdit);
