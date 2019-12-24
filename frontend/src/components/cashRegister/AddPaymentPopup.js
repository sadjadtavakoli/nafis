import React, { useState,useEffect } from "react";
import { Form, Card, Button } from "semantic-ui-react";
import { useStateObject } from "../../utils/Hooks";
import { connect } from "react-redux";
import { addPaymentToBillv2 } from "../../actions/BillActions";
import { toGregorian } from "../utils/jalaaliUtils";
import { validatePaymentData } from "../../actions/validatePayment";

const AddPaymentPopup = props => {
  const [error, setError] = useState(undefined);
  const [selectedPaymentType, setSelectedPaymentType] = useState(undefined);
  const options = [
    { text: "چک", value: "cheque", key: 1 },
    { text: "نقد و کارت", value: "cash_card", key: 2 }
  ];

  const selectHandler = (e, { value }) => {
    setSelectedPaymentType(value);
    setPaymentFormData("type")(value);
    if (value !== "cash_card")
      setPaymentFormData("amount")(Number(props.remainingPrice));
      // setPaymentFormData("card_amount")(Number(props.remainingPrice));
    // else 
      // setPaymentFormData("amount")(Number(props.remainingPrice));
  };

  const [paymentFormData, setPaymentFormData] = useStateObject({
    type: undefined,
    cash_amount: 0,
    card_amount: 0,
    amount: undefined,
    number: undefined,
    bank: undefined,
    issue_date: undefined,
    expiry_date: undefined
  });
  let [amountIsNotValid, setAmountValidation] = useState(false);
  const handleSubmit = () => {
    // if( selectedPaymentType === 'cash_card')
    try {
      const paymentData = validatePaymentData(paymentFormData);
      props.addPaymentToBillv2(props.billID, paymentData).then(props.onClose);
    } catch (error) {
      setError({ content: error.message, pointing: "below" });
    }
  };

  const JalaliToGregorianString = str =>
    Object.values(toGregorian(...str.split("/").map(Number))).join("-");

  const anotherInputIsEmpty = anotherInput => {
    if (!paymentFormData.cash_amount && !paymentFormData.card_amount)
      return true;

    if (!paymentFormData[anotherInput] || paymentFormData[anotherInput] <= 0)
      return true;

    return false;
  };
  const chequeAmountsValidationHandler = () => {
      let sum = 0;
        sum = paymentFormData.card_amount + paymentFormData.cash_amount;
    if ( sum <= props.remainingPrice) {
      setAmountValidation(false);
    } else {
      setAmountValidation(true);
    };
    
}
  
  useEffect(() => {
    chequeAmountsValidationHandler();
    console.log(paymentFormData.cash_amount=== '',paymentFormData.card_amount=== '')
    if (paymentFormData.cash_amount === '' || paymentFormData.card_amount === '')
      setAmountValidation(true)
  }, [paymentFormData.cash_amount,paymentFormData.card_amount]);
  
  return (
    <Card className="rtl">
      <Card.Content>
        <Card.Header className="yekan">افزودن پرداخت جدید</Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Form>
          <Form.Group widths="equal">
            <Form.Select
              width={10}
              label="انتخاب نوع پرداخت"
              placeholder="انتخاب نوع پرداخت"
              onChange={selectHandler}
              options={options}
              required
            />
          </Form.Group>
          <Form.Input
            type="number"
            required={anotherInputIsEmpty("cash_amount")}
            // disabled={!anotherInputIsEmpty("cash_amount")}
            className={`ltr placeholder-rtl ${
              selectedPaymentType === "cash_card" ? "" : "d-none"
            }`}
            onChange={e => {
              setError(undefined);
              setPaymentFormData("card_amount")(e.target.value===''?'':Number(e.target.value));
            }}
            value={paymentFormData.card_amount}
            label="مبلغ پرداخت کارتی"
            placeholder="مبلغ پرداخت کارتی"
            error={error}
          />
          <Form.Input
            type="number"
            required={anotherInputIsEmpty("card_amount")}
            // disabled={!anotherInputIsEmpty("card_amount")}
            className={`ltr placeholder-rtl ${
              selectedPaymentType === "cash_card" ? "" : "d-none"
            }`}
            onChange={e => {
              setError(undefined);
              setPaymentFormData("cash_amount")(e.target.value===''?'':Number(e.target.value));
            }}
            value={paymentFormData.cash_amount}
            label="مبلغ پرداخت نقدی"
            placeholder="مبلغ پرداخت نقدی"
            error={error}
          />
          <Form.Input
            type="number"
            required
            className={`ltr placeholder-rtl ${
              selectedPaymentType === "cheque" ? "" : "d-none"
            }`}
            onChange={e => setPaymentFormData("amount")(Number(e.target.value))}
            value={paymentFormData.amount}
            label="مبلغ پرداختی"
            placeholder="مبلغ پرداختی"
          />
          <Form.Input
            type="number"
            required={selectedPaymentType === "cheque" ? true : false}
            className={`ltr placeholder-rtl ${
              selectedPaymentType === "cheque" ? "" : "d-none"
            }`}
            onChange={e => setPaymentFormData("number")(Number(e.target.value))}
            label="شماره چک"
            placeholder="شماره چک"
          />
          <Form.Input
            type="text"
            required={selectedPaymentType === "cheque" ? true : false}
            className={`ltr placeholder-rtl ${
              selectedPaymentType === "cheque" ? "" : "d-none"
            }`}
            onChange={e => setPaymentFormData("bank")(e.target.value)}
            label="بانک"
            placeholder="بانک"
          />
          <Form.Input
            type="text"
            required={selectedPaymentType === "cheque" ? true : false}
            className={`ltr placeholder-rtl ${
              selectedPaymentType === "cheque" ? "" : "d-none"
            }`}
            onChange={e => {
              setPaymentFormData("issue_date")(
                JalaliToGregorianString(e.target.value)
              );
            }}
            label="تاریخ صدور"
            placeholder="نمونه: 1398/1/10"
          />
          <Form.Input
            type="text"
            required={selectedPaymentType === "cheque" ? true : false}
            className={`ltr placeholder-rtl ${
              selectedPaymentType === "cheque" ? "" : "d-none"
            }`}
            onChange={e => {
              setPaymentFormData("expiry_date")(
                JalaliToGregorianString(e.target.value)
              );
            }}
            label="تاریخ اعتبار"
            placeholder="نمونه: 1398/1/10"
          />

          <div className="text-center">
            <Button.Group className="ltr">
              <Button className="yekan" onClick={props.onClose}>
                بستن&nbsp;&nbsp;&nbsp;
              </Button>
              <Button.Or text="یا" />
              <Button className="yekan" disabled={amountIsNotValid} onClick={handleSubmit} positive>
                افزودن
              </Button>
            </Button.Group>
          </div>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default connect(
  (state, ownProps) => {
    const bill = state.bills.bills.find(bill => bill.pk === ownProps.billID);
    const finalPrice = bill.final_price;
    const remainingPrice = bill.remaining_payment;
    const totalPaidPayment = bill.payments.reduce(
      (acc, { amount }) => acc + amount,
      0
    );
    const totalDiscount = bill.total_discount;
    const frontEndComputedRemainingPrice =
      Number(finalPrice) - Number(totalPaidPayment) - Number(totalDiscount);
    return {
      finalPrice,
      remainingPrice,
      totalPaidPayment,
      totalDiscount,
      frontEndComputedRemainingPrice: !Number.isNaN(
        frontEndComputedRemainingPrice
      )
        ? Number(frontEndComputedRemainingPrice)
        : ''
    };
  },
  { addPaymentToBillv2 }
)(AddPaymentPopup);
