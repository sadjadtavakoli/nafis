import React from "react";
import { Form, Label, Header } from "semantic-ui-react";
import renderField from "./RenderField";
const BuyerDetails = props => {
  return (
    <>
      <Header as="h3" textAlign="right">
        <span>خریدار: </span>
      </Header>
      <Form.Group className="rtl" widths="equal">
        {renderField(props.buyer, "first_name", "نام")}
        {renderField(props.buyer, "last_name", "نام خانوادگی")}
        {renderField(props.buyer, "phone_number", "شماره تلفن همراه")}
      </Form.Group>
      <Form.Group widths="equal">
        {renderField(props.buyer, "email", "ایمیل")}
        {renderField(props.buyer, "address", "آدرس")}
        {renderField(props.buyer, "points", "امتیاز مشتری")}
      </Form.Group>
    </>
  );
};
export default BuyerDetails;
