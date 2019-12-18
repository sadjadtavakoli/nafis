import React from "react";
import { Header, Popup, Button, Form, Divider, Label } from "semantic-ui-react";
import AddPaymentPopup from "./AddPaymentPopup";
import renderField from "./RenderField";
import { priceToPersian, enToFa } from "../utils/numberUtils";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import { compose } from "../../utils/FunctionalUtils";
import { connect } from "react-redux";
import { removePayment } from "../../actions/BillActions";

const PaymentDetails = props => {
  const convertToFA = name => {
    const obj = { cheque: "چک", cash: "نقد", card: "کارت" };
    return obj[name];
  };

  const removePayment = (billID, paymentID) => {
    props.removePayment(billID, paymentID);
  };

  return (
    <div>
      <Header as="h3" textAlign="right">
        <span>پرداخت‌ها: </span>
      </Header>
      {props.payments.map((payment, index) => {
        return (
          <div>
            <Form.Group
              className="rtl"
              widths="4"
              key={`bill_payments_${index}`}
            >
              {renderField(
                payment,
                "create_date",
                "تاریخ ایجاد",
                compose(enToFa, standardTimeToJalaali)
              )}
              {renderField(payment, "amount", "مبلغ پرداختی", priceToPersian)}
              {renderField(payment, "type", "نوع پرداخت", convertToFA)}
              <Label
                as="a"
                color="red"
                onClick={() => removePayment(props.billPK, payment.pk)}
              >
                حذف
              </Label>
            </Form.Group>
            {payment.type === "cheque" ? (
              <Form.Group className="rtl" widths="4">
                {renderField(payment.cheque, "number", "شماره چک", enToFa)}
                {renderField(payment.cheque, "bank", "بانک")}
                {renderField(payment.cheque, "issue_date", "تاریخ صدور", date =>
                  enToFa(standardTimeToJalaali(new Date(date)))
                )}
                {renderField(
                  payment.cheque,
                  "expiry_date",
                  "تاریخ اعتبار",
                  date => enToFa(standardTimeToJalaali(new Date(date)))
                )}
              </Form.Group>
            ) : null}
            <Divider />
          </div>
        );
      })}
      <div className="text-center padded">
        <Popup
          style={{ top: -35 }}
          content={
            <AddPaymentPopup
              onClose={props.toggleAddItemPopup}
              billID={props.billPK}
            />
          }
          open={props.isOpenAddItem}
          className="no-filter"
          position="bottom center"
          wide="very"
          trigger={
            <Button
              circular
              onClick={props.toggleAddItemPopup}
              color="green"
              size="huge"
              icon="add"
            />
          }
        />
      </div>
    </div>
  );
};

export default connect(null, { removePayment })(PaymentDetails);
