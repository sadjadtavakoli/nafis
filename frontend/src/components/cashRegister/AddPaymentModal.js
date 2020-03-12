import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, Button, Input, Modal, Icon } from "semantic-ui-react";
import { addPaymentToBill } from "../../actions/CashRegisterActions";
import { addPaymentToSupplierBill } from "../../actions/SuppliersActions";
import { getTodayJalaali, toGregorian } from "../utils/jalaaliUtils";
import { enToFa } from "../utils/numberUtils";
import { toastr } from "react-redux-toastr";
import SingleDatePickerModal from "../utils/SingleDatePickerModal";

const AddPaymentModal = ({
  open,
  scrollToBottom,
  onClose,
  price,
  pk,
  refetch,
  editFactor
}) => {
  const [inputNameForDatePicker, setInputNameForDatePicker] = useState(null);
  const [titleForDatePicker, setTitleForDatePicker] = useState(null);
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  const [todayJalaali, setTodayJalaali] = useState(null);
  const paymentOptions = !editFactor
    ? [
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
      ]
    : [
        {
          key: "cheque",
          text: "چک",
          value: "cheque"
        },
        {
          key: "cash",
          text: "نقد",
          value: "cash"
        },
        {
          key: "card",
          text: "کارت",
          value: "card"
        }
      ];
  const [cardAmount, setCardAmount] = useState(price);
  const [cashAmount, setCashAmount] = useState(0);
  const [disableButton, setDisableButton] = useState(false);
  const [chequeAmount, setChequeAmount] = useState(price);
  const [chequeNumber, setChequeNumber] = useState(null);
  const [bank, setBank] = useState(null);
  const [issueDate, setIssueDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [type, setType] = useState(null);

  const dispatch = useDispatch();

  const setStateType = (_, { value }) => {
    setType(value);
  };

  useEffect(() => {
    setTodayJalaali(enToFa(getTodayJalaali()));
  }, []);

  useEffect(() => {
    if (cardAmount > price || chequeAmount > price) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [cardAmount, chequeAmount]);

  const convertToG = date => {
    let arr = date.split("-");
    let obj = toGregorian(Number(arr[0]), Number(arr[1]), Number(arr[2]));
    return obj.gy + "-" + obj.gm + "-" + obj.gd;
  };

  const handleSubmit = () => {
    let prepareData = {};
    if (editFactor) {
      let issue_date = convertToG(issueDate);
      let expiry_date = convertToG(expiryDate);
      if (type === "cash") {
        prepareData = {
          amount: cashAmount,
          type
        };
      }
      if (type === "card") {
        prepareData = {
          amount: cardAmount,
          type
        };
      }
      if (type === "cheque") {
        prepareData = {
          bank,
          issue_date,
          expiry_date,
          number: chequeNumber
        };
      }
    } else {
      if (type === "cash_card") {
        let card_amount = Number(cardAmount);
        let cash_amount = Number(cashAmount);
        prepareData = {
          create_date: getTodayJalaali(),
          card_amount,
          cash_amount,
          type
        };
      }
      if (type === "cheque") {
        let issue_date = convertToG(issueDate);
        let expiry_date = convertToG(expiryDate);
        prepareData = {
          amount: chequeAmount,
          number: chequeNumber,
          bank,
          issue_date,
          expiry_date,
          type
        };
      }
    }

    if (editFactor) {
      dispatch(addPaymentToSupplierBill(pk, prepareData))
        .then(() => {
          toastr.success("عملیات با موفقیت انجام شد", "پرداخت جدید اضافه شد");
          refetch();
        })
        .catch(() =>
          toastr.error(
            "خطا در فرایند عملیات",
            "لطفا پس از بررسی مجدد دوباره امتحان کنید"
          )
        );
    } else {
      dispatch(addPaymentToBill(pk, prepareData))
        .then(() => {
          toastr.success("عملیات با موفقیت انجام شد");
          refetch();
        })
        .catch(() => {
          toastr.error("خطا در فرایند عملیات اضافه کردن پرداخت");
        });
    }
    scrollToBottom();
    onClose();
  };

  const setDate = (inputName, selectedDate) => {
    console.log(inputName);
    setCalendarIsOpen(false);
    if (inputName === "issue_date") setIssueDate(selectedDate);
    else if (inputName === "expiry_date") setExpiryDate(selectedDate);
  };

  const calendarIconRenderer = (status, title) => {
    return (
      <Icon
        style={{ paddingTop: "0.3em" }}
        onClick={() => {
          setInputNameForDatePicker(status);
          setTitleForDatePicker(`انتخاب ${title}`);

          handleCalendarClick(true);
        }}
        name="calendar alternate outline"
        color="teal"
        size="big"
        className="date-picker-icon"
      />
    );
  };

  const handleCalendarClick = status => setCalendarIsOpen(status);

  return (
    <React.Fragment>
      <SingleDatePickerModal
        title={titleForDatePicker}
        onClose={() => handleCalendarClick(false)}
        isOpen={calendarIsOpen}
        inputName={inputNameForDatePicker}
        setDate={setDate}
      />
      <Modal
        dimmer="blurring"
        open={open}
        onClose={onClose}
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
            options={paymentOptions}
            onChange={setStateType}
          />

          {type === "cheque" && (
            <React.Fragment>
              <h5 className="yekan">
                مبلغ پرداختی&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                type="number"
                className="ltr"
                defaultValue={price}
                onChange={e => setChequeAmount(e.target.value)}
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
                onChange={e => setChequeNumber(e.target.value)}
              />
              <h5 className="yekan">
                بانک&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="rtl placeholder-rtl text-right yekan"
                placeholder="بانک"
                onChange={e => setBank(e.target.value)}
              />
              <h5 className="yekan">
                تاریخ صدور&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <div className="d-inline-flex w-100">
                <Input
                  value={issueDate}
                  fluid
                  readOnly
                  className="rtl placeholder-rtl text-right yekan w-100"
                  placeholder={`نمونه: ${todayJalaali}`}
                  onChange={e => setIssueDate(e.target.value)}
                />
                {calendarIconRenderer("issue_date", "تاریخ صدور")}
              </div>
              <h5 className="yekan">
                تاریخ اعتبار&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <div className="d-inline-flex w-100">
                <Input
                  value={expiryDate}
                  fluid
                  readOnly
                  className="rtl placeholder-rtl text-right yekan w-100"
                  placeholder={`نمونه: ${todayJalaali}`}
                  onChange={e => setExpiryDate(e.target.value)}
                />
                {calendarIconRenderer("expiry_date", "تاریخ اعتبار")}
              </div>
            </React.Fragment>
          )}

          {type === "cash" && (
            <React.Fragment>
              <h5 className="yekan">
                مبلغ پرداختی کارتی&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="ltr"
                type="number"
                defaultValue={price}
                onChange={e => setCashAmount(e.target.value)}
              />
            </React.Fragment>
          )}

          {type === "card" && (
            <React.Fragment>
              <h5 className="yekan">
                مبلغ پرداختی کارتی&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="ltr"
                type="number"
                defaultValue={price}
                onChange={e => setCardAmount(e.target.value)}
              />
            </React.Fragment>
          )}

          {type === "cash_card" && (
            <React.Fragment>
              <h5 className="yekan">
                مبلغ پرداختی کارتی&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="ltr"
                type="number"
                defaultValue={price}
                onChange={e => setCardAmount(e.target.value)}
              />
              <h5 className="yekan">مبلغ پرداختی نقدی</h5>
              <Input
                fluid
                className="ltr"
                type="number"
                defaultValue="0"
                onChange={e => setCashAmount(e.target.value)}
              />
            </React.Fragment>
          )}
        </Modal.Content>
        <Modal.Actions className="ltr text-center">
          <Button.Group>
            <Button className="yekan" onClick={onClose}>
              بستن
            </Button>
            <Button.Or text="یا" className="yekan" />
            <Button
              className="yekan"
              positive
              onClick={handleSubmit}
              disabled={disableButton}
            >
              افزودن
            </Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    </React.Fragment>
  );
};

export default AddPaymentModal;
