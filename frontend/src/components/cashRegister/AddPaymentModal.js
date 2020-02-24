import React from "react";
import { Dropdown, Button, Input, Modal } from "semantic-ui-react";
import { connect } from "react-redux";
import { addPaymentToBill } from "../../actions/CashRegisterActions";
import { getTodayJalaali } from "../utils/jalaaliUtils";
import { toastr } from "react-redux-toastr";

class AddPaymentModal extends React.Component {
  state = {
    paymentOptions: [
      {
        key: "cheque",
        text: "چک",
        value: "cheque"
      },
      {
        key: "card",
        text: "نقد و کارت",
        value: "cash_card"
      }
    ],
    card_amount: this.props.price,
    cash_amount: 0
  };

  setStateType = (_, { value }) => {
    this.setState({ type: value });
  };

  handleInputChange = (e, status) => {
    this.setState({
      [status]: e.target.value
    });
  };

  handleSubmit = () => {
    const prepareData = {
      create_date: getTodayJalaali(),
      card_amount: this.state.card_amount + this.state.cash_amount,
      type: this.state.type
    };
    this.props
      .addPaymentToBill(this.props.pk, prepareData)
      .then(() => {
        toastr.success("عملیات با موفقیت انجام شد");
        this.props.refetch();
      })
      .catch(() => {
        toastr.error("خطا در فرایند عملیات");
      });
    this.props.onClose();
  };

  render() {
    return (
      <Modal
        dimmer="blurring"
        open={this.props.open}
        onClose={this.props.onClose}
        className="rtl text-right"
        size="tiny"
      >
        <Modal.Header className="d-flex">
          <h3
            className="yekan d-flex"
            style={{ alignItems: "center", marginBottom: 0 }}
          >
            افزودن پرداخت جدید
          </h3>
        </Modal.Header>
        <Modal.Content>
          <h5 className="yekan">
            انتخاب نوع پرداخت&nbsp;
            <span
              style={{ fontWeight: "bold", color: "red" }}
              onChange={this.handleTypeChange}
            >
              *
            </span>
          </h5>
          <Dropdown
            placeholder="انتخاب نوع پرداخت"
            className="yekan"
            fluid
            selection
            options={this.state.paymentOptions}
            onChange={this.setStateType}
          />
          {this.state.type === "cheque" && (
            <React.Fragment>
              <h5 className="yekan">
                مبلغ پرداختی&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                type="number"
                fluid
                className="ltr"
                defaultValue={this.props.price}
              />
              <h5 className="yekan">
                شماره چک&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                type="number"
                fluid
                className="rtl placeholder-rtl"
                placeholder="شماره چک"
              />
              <h5 className="yekan">
                بانک&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="rtl placeholder-rtl text-right yekan"
                placeholder="بانک"
              />
              <h5 className="yekan">
                تاریخ صدور&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="rtl placeholder-rtl text-right yekan"
                placeholder="نمونه:‌ 1398/1/10"
              />
              <h5 className="yekan">
                تاریخ اعتبار&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="rtl placeholder-rtl text-right yekan"
                placeholder="نمونه:‌ 1398/1/10"
              />
            </React.Fragment>
          )}
          {this.state.type === "cash_card" && (
            <React.Fragment>
              <h5 className="yekan">
                مبلغ پرداختی کارتی&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="ltr"
                type="number"
                defaultValue={this.props.price}
                onChange={e => {
                  this.handleInputChange(e, "card_amount");
                }}
              />
              <h5 className="yekan">مبلغ پرداختی نقدی</h5>
              <Input
                fluid
                className="ltr"
                type="number"
                defaultValue="0"
                onChange={e => {
                  this.handleInputChange(e, "cash_amount");
                }}
              />
            </React.Fragment>
          )}
        </Modal.Content>
        <Modal.Actions className="ltr text-center">
          <Button.Group>
            <Button className="yekan" onClick={this.props.onClose}>
              بستن
            </Button>
            <Button.Or text="یا" className="yekan" />
            <Button className="yekan" positive onClick={this.handleSubmit}>
              افزودن
            </Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default connect(null, { addPaymentToBill, getTodayJalaali })(
  AddPaymentModal
);
