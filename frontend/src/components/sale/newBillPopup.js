import React from "react";
import { connect } from "react-redux";
import { Button, Form, Card, Label, Icon } from "semantic-ui-react";
import { getProductsByCode } from "../../actions/DepositoryActions";
import { addNewItem } from "../../actions/SaleActions";
import {
  enToFa,
  phoneNumberBeautifier,
  priceToPersian
} from "../utils/numberUtils";
import { toastr } from "react-redux-toastr";

class NewBillPopup extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    product: "",
    amount: "",
    end_of_roll: false,
    discount: 0,
    end_of_roll_amount: 0,
    disabled: true,
    notFound: NaN,
    productData: {}
  };

  changeInput = (event, inputName) => {
    let value = Number(event.target.value);
    this.setState({ [inputName]: value }, () => {
      if (inputName === "product") {
        this.handleSearchChange(this.state.product);
      }
      if (this.state.amount <= Number(this.state.productData.stock_amount)) {
        this.setState({ disabled: false });
      } else {
        this.setState({ disabled: true });
      }
    });
  };

  toggleIsEndOfRoll = () => {
    this.setState(prevState => ({
      end_of_roll: !prevState.end_of_roll,
      end_of_roll_amount: ""
    }));
  };

  submitForm = () => {
    if (
      String(this.state.product).length < 1 ||
      String(this.state.amount).length < 1 ||
      String(this.state.discount).length < 1 ||
      (this.state.end_of_roll && this.state.end_of_roll_amount.length < 1)
    ) {
      alert("فرم افزودن آیتم معتبر نبوده است");
    } else {
      let prepareData = {
        name: this.state.productData.name,
        bill: this.props.pk,
        product: this.state.product,
        amount: this.state.amount,
        end_of_roll: this.state.end_of_roll,
        discount: this.state.discount,
        end_of_roll_amount: this.state.end_of_roll_amount,
        selling_price: this.state.productData.selling_price
      };
      if (this.props.pk) {
        this.props.addNewItem(this.props.pk, prepareData).then(res => {
          this.props.refetch(res);
          setTimeout(() => {
            toastr.success("ثبت آیتم جدید", "ثبت آیتم جدید با موفقیت انجام شد");
            this.props.onClose();
          }, 500);
        });
      } else {
        this.props.onSubmit(prepareData);
      }
    }
  };

  handleSearchChange = value => {
    this.setState({ product: Number(value) }, () => {
      if (
        String(this.state.product).length < 1 ||
        String(this.state.product) === "0"
      ) {
        this.setState({ disabled: true, notFound: NaN });
      } else {
        this.props
          .getProductsByCode(this.state.product)
          .then(() => {
            this.setState({
              notFound: false,
              productData: this.props.productsList
            });
          })
          .catch(() => {
            this.setState({
              notFound: true,
              disabled: true,
              productData: {}
            });
          });
      }
    });
  };

  render() {
    return (
      <Card className="rtl" fluid key={0}>
        <Card.Content>
          <Card.Header className="d-flex">
            <h3
              className="yekan d-flex"
              style={{ alignItems: "center", marginBottom: 0 }}
            >
              افزودن آیتم جدید
            </h3>
            <span>
              {this.props.pk ? (
                <Label color="green ltr">
                  {enToFa(phoneNumberBeautifier(this.props.phoneNumber))}
                </Label>
              ) : null}
            </span>
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
          {isNaN(this.state.notFound) ? (
            <Label className="invisible">ا</Label>
          ) : null}
          {this.state.notFound === false ? (
            <Label color="teal">
              <Icon name="info" />
              <span>نام محصول:</span>&nbsp;
              <span>{enToFa(this.state.productData.name)}</span>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>مقدار باقی مانده:</span>&nbsp;
              <span>{enToFa(this.state.productData.stock_amount)}</span>&nbsp;
              <span>متر</span>
              <p>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span>قیمت هر متر:</span>&nbsp;
                <span>
                  {enToFa(priceToPersian(this.state.productData.selling_price))}
                </span>
                <span>&nbsp; تومان</span>
              </p>
            </Label>
          ) : null}
          {this.state.notFound === true ? (
            <Label color="red">
              <Icon name="warning circle" />
              <span>محصول مورد نظر یافت نشد</span>
            </Label>
          ) : null}
          <Form>
            <Form.Group widths="equal">
              <Form.Input
                className="ltr placeholder-rtl"
                type="number"
                fluid
                label="کد محصول"
                onChange={e => this.changeInput(e, "product")}
              />
              <Form.Input
                className="ltr placeholder-rtl"
                type="number"
                fluid
                label="مقدار(متر)"
                onChange={e => this.changeInput(e, "amount")}
              />
              <Form.Input
                className="ltr placeholder-rtl"
                type="number"
                fluid
                label="تخفیف"
                onChange={e => this.changeInput(e, "discount")}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Checkbox
                toggle
                className="ltr placeholder-rtl"
                checked={this.state.end_of_roll}
                onChange={this.toggleIsEndOfRoll}
                label="ته طاقه؟"
              />
              <Form.Input
                type="number"
                className={`ltr placeholder-rtl ${
                  this.state.end_of_roll ? "" : "invisible"
                }`}
                onChange={e => this.changeInput(e, "end_of_roll_amount")}
                label="مقدار حساب شده"
                placeholder="مقدار حساب شده"
              />
            </Form.Group>

            <div className="text-center">
              <Button.Group className="ltr">
                <Button className="yekan" onClick={this.props.onClose}>
                  بستن
                </Button>
                <Button.Or text="یا" />
                <Button
                  className="yekan"
                  disabled={this.state.disabled}
                  onClick={this.submitForm}
                  positive
                >
                  افزودن
                </Button>
              </Button.Group>
            </div>
          </Form>
        </Card.Content>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    productsList: state.depository.productsList
  };
};
export default connect(mapStateToProps, { getProductsByCode, addNewItem })(
  NewBillPopup
);
