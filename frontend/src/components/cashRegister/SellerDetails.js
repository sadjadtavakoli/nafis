import React from "react";
import { Form, Label, Header } from "semantic-ui-react";
import renderField from "./RenderField";

const SellerDetails = props => {
  return (
    <>
      <Header as="h3" textAlign="right">
        <span>فروشنده: </span>
      </Header>
      <Form.Group className="rtl" widths="equal">
        {renderField(props.seller, "first_name", "نام")}
        {renderField(props.seller, "last_name", "نام خانوادگی")}
        {renderField(props.seller, "email", "ایمیل")}
      </Form.Group>
      <Form.Group widths="equal">
        {renderField(props.seller, "username", "شناسه‌ کاربری")}
        {renderField(props.seller, "national_id", "کد ملی")}
        {renderField(props.seller, "address", "آدرس")}
      </Form.Group>
    </>
  );
};
export default SellerDetails;
