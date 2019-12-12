import React, { useState } from "react";
import { Form, Card, Button } from "semantic-ui-react";
import { useStateObject } from "../../utils/Hooks";
import { connect } from "react-redux";
import { addPaymentToBill } from "../../actions/BillActions";
import { toGregorian } from "../utils/jalaaliUtils";

const AddPaymentPopup = props => {
  const [selectedPaymentType, setSelectedPaymentType] = useState(undefined);
  const options = [
    { text: "چک", value: "cheque", key: 1 },
    { text: "نقد", value: "cash", key: 2 },
    { text: "کارت", value: "card", key: 3 }
  ];
  const selectHandler = (e, { value }) => {
    setSelectedPaymentType(value);
    setPaymentFormData("type")(value);
  };

  const [paymentFormData, setPaymentFormData] = useStateObject({
    amount: undefined,
    type: undefined,
    number: undefined,
    bank: undefined,
    issue_date: undefined,
    expiry_date: undefined
  });

  const handleSubmit = () => {
    props.addPaymentToBill(props.billID, paymentFormData).then(props.onClose);
  };

  const JalaliToGregorianString = str =>
    Object.values(toGregorian(...str.split("/").map(Number))).join("-");

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
            required
            className={`ltr placeholder-rtl ${
              selectedPaymentType ? "" : "invisible"
            }`}
            onChange={e => setPaymentFormData("amount")(Number(e.target.value))}
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
              <Button className="yekan" onClick={handleSubmit} positive>
                افزودن
              </Button>
            </Button.Group>
          </div>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default connect(null, { addPaymentToBill })(AddPaymentPopup);
