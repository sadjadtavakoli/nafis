import React from "react";
import { Form, Label, Header } from "semantic-ui-react";
import { enToFa, priceToPersian } from "../utils/numberUtils";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import renderField from "./RenderField";
import { compose } from "../../utils/FunctionalUtils";

const BillDetails = props => {
  return (
    <div>
      <Header as="h3" textAlign="right">
        <span>فاکتور: </span>
      </Header>
      <Form.Group className="rtl" widths="equal">
        {renderField(
          props.bill,
          "create_date",
          "تاریخ ایجاد",
          compose(enToFa, standardTimeToJalaali)
        )}
        {renderField(props.bill, "discount", "تخفیف فاکتور", text =>
          priceToPersian(text)
        )}
        {renderField(props.bill, "used_points", "امتیاز استفاده شده", text =>
          enToFa(text)
        )}
      </Form.Group>
      <Form.Group className="rtl" widths="equal">
        {renderField(props.bill, "total_discount", "کل تخفیف", text =>
          priceToPersian(text)
        )}
        {renderField(props.bill, "price", "مبلغ بدون تخفیف", text =>
          priceToPersian(text)
        )}
        {renderField(props.bill, "final_price", "مبلغ نهایی", text =>
          priceToPersian(text)
        )}
      </Form.Group>
    </div>
  );
};
export default BillDetails;
