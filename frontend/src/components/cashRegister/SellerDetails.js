import React from "react";
import { Form, Label, Header } from "semantic-ui-react";
import renderField from "./RenderField";

const SellerDetails = props => {
  return (
    <React.Fragment>
      <Header as="h3" textAlign="right">
        <span>فروشنده: </span>
      </Header>
      <Form.Group className="rtl" widths="equal">
        {renderField(props.seller, "first_name", "نام")}
        {renderField(props.seller, "last_name", "نام خانوادگی")}
      </Form.Group>
      <Form.Group widths="equal">
        {renderField(props.seller, "username", "شناسه‌ کاربری")}
        {renderField(props.seller, "national_id", "کد ملی")}
      </Form.Group>
    </React.Fragment>
  );
};
export default SellerDetails;
