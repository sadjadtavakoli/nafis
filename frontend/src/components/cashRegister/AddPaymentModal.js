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
    cash_amount: 0,
    disable_button: false,
    cheque_amount: this.props.price,
    cheque_number: null,
    bank: null,
    issue_date: null,
    expiry_date: null
  };

  setStateType = (_, { value }) => {
    this.setState({ type: value }, () => {
      this.setState({
        card_amount: this.props.price,
        cash_amount: 0,
        disable_button: false,
        cheque_amount: this.props.price,
        cheque_number: null,
        bank: null,
        issue_date: null,
        expiry_date: null
      });
    });
  };

  handleInputChange = (e, status) => {
    this.setState(
      {
        [status]: e.target.value
      },
      () => {
        if (this.state.type === "cash_card") {
          if (
            Number(this.state.card_amount) + Number(this.state.cash_amount) >
            this.props.price
          ) {
            this.setState({ disable_button: true });
          } else {
            this.setState({ disable_button: false });
          }
        }
        if (this.state.type === "cheque") {
          if (Number(this.state.cheque_amount) > this.props.price) {
            this.setState({ disable_button: true });
          } else {
            this.setState({ disable_button: false });
          }
        }
      }
    );
  };

  handleSubmit = () => {
    let prepareData = {};
    if (this.state.type === "cash_card") {
      let card_amount =
        Number(this.state.card_amount) + Number(this.state.cash_amount);
      prepareData = {
        create_date: getTodayJalaali(),
        card_amount,
        type: this.state.type
      };
    } else {
      prepareData = {
        create_date: getTodayJalaali(),
        cheque_amount: this.state.cheque_amount,
        cheque_number: this.state.cheque_number,
        bank: this.state.bank,
        issue_date: this.state.issue_date,
        expiry_date: this.state.expiry_date
      };
    }
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
            <span style={{ fontWeight: "bold", color: "red" }}>*</span>
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
                onChange={e => {
                  this.handleInputChange(e, "cheque_amount");
                }}
              />
              <h5 className="yekan">
                شماره چک&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                type="number"
                fluid
                className="rtl placeholder-rtl text-right"
                placeholder="شماره چک"
                onChange={e => {
                  this.handleInputChange(e, "cheque_number");
                }}
              />
              <h5 className="yekan">
                بانک&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="rtl placeholder-rtl text-right yekan"
                placeholder="بانک"
                onChange={e => {
                  this.handleInputChange(e, "bank");
                }}
              />
              <h5 className="yekan">
                تاریخ صدور&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="rtl placeholder-rtl text-right yekan"
                placeholder="نمونه:‌ 1398/1/10"
                onChange={e => {
                  this.handleInputChange(e, "issue_date");
                }}
              />
              <h5 className="yekan">
                تاریخ اعتبار&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="rtl placeholder-rtl text-right yekan"
                placeholder="نمونه:‌ 1398/1/10"
                onChange={e => {
                  this.handleInputChange(e, "expiry_date");
                }}
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
            <Button
              className="yekan"
              positive
              onClick={this.handleSubmit}
              disabled={this.state.disable_button}
            >
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
