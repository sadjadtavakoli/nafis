import React from "react";
import { Dropdown, Button, Input, Modal, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { addPaymentToBill } from "../../actions/CashRegisterActions";
import { getTodayJalaali, toGregorian } from "../utils/jalaaliUtils";
import { enToFa } from "../utils/numberUtils";
import { toastr } from "react-redux-toastr";
import SingleDatePickerModal from "../utils/SingleDatePickerModal";

class AddPaymentModal extends React.Component {
  state = {
    inputNameForDatePicker: "",
    titleForDatePicker: "",
    calendarIsOpen: false,
    todayJalaali: "",
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
    issue_date: "",
    expiry_date: ""
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
        issue_date: "",
        expiry_date: ""
      });
    });
  };

  componentDidMount() {
    this.setState({
      todayJalaali: enToFa(getTodayJalaali())
    });
  }
  
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

  convertToG = date => {
    let arr = date.split("-");
    let obj = toGregorian(Number(arr[0]), Number(arr[1]), Number(arr[2]));
    return obj.gy + "-" + obj.gm + "-" + obj.gd;
  };

  handleSubmit = () => {
    let prepareData = {};
    if (this.state.type === "cash_card") {
      let card_amount = Number(this.state.card_amount);
      let cash_amount = Number(this.state.cash_amount);
      prepareData = {
        create_date: getTodayJalaali(),
        card_amount: card_amount,
        cash_amount: cash_amount,
        type: this.state.type
      };
    } else {
      let issue_date = this.convertToG(this.state.issue_date);
      let expiry_date = this.convertToG(this.state.expiry_date);
      prepareData = {
        amount: this.state.cheque_amount,
        number: this.state.cheque_number,
        bank: this.state.bank,
        issue_date: issue_date,
        expiry_date: expiry_date,
        type: this.state.type
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

  setDate = (inputName, selectedDate) => {
    console.log(inputName, selectedDate);
    this.setState({
      [inputName]: selectedDate,
      calendarIsOpen: false
    });
  };

  calendarIconRenderer = (status, title) => {
    return (
      <Icon
        style={{ paddingTop: "0.3em" }}
        onClick={() => {
          this.setState(
            {
              inputNameForDatePicker: status,
              anyChange: true,
              titleForDatePicker: `انتخاب ${title}`
            },
            () => {
              this.handleCalendarClick(true);
            }
          );
        }}
        name="calendar alternate outline"
        color="teal"
        size="big"
        className="date-picker-icon"
      />
    );
  };
  handleCalendarClick = status => {
    this.setState({
      calendarIsOpen: status
    });
  };
  render() {
    return (
      <React.Fragment>
        <SingleDatePickerModal
          title={this.state.titleForDatePicker}
          onClose={() => this.handleCalendarClick(false)}
          isOpen={this.state.calendarIsOpen}
          inputName={this.state.inputNameForDatePicker}
          setDate={this.setDate}
        />
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
                <div className="d-inline-flex w-100">
                  <Input
                    value={this.state.issue_date}
                    fluid
                    readOnly
                    className="rtl placeholder-rtl text-right yekan w-100"
                    placeholder={`نمونه: ${this.state.todayJalaali}`}
                    onChange={e => {
                      this.handleInputChange(e, "issue_date");
                    }}
                  />
                  {this.calendarIconRenderer("issue_date", "تاریخ صدور")}
                </div>
                <h5 className="yekan">
                  تاریخ اعتبار&nbsp;
                  <span style={{ fontWeight: "bold", color: "red" }}>*</span>
                </h5>
                <div className="d-inline-flex w-100">
                  <Input
                    value={this.state.expiry_date}
                    fluid
                    readOnly
                    className="rtl placeholder-rtl text-right yekan w-100"
                    placeholder={`نمونه: ${this.state.todayJalaali}`}
                    onChange={e => {
                      this.handleInputChange(e, "expiry_date");
                    }}
                  />
                  {this.calendarIconRenderer("expiry_date", "تاریخ اعتبار")}
                </div>
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
      </React.Fragment>
    );
  }
}

export default connect(null, { addPaymentToBill, getTodayJalaali })(
  AddPaymentModal
);
