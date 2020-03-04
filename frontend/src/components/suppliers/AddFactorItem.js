import React, { useState, useEffect } from "react";
import { Card, Checkbox, Header, Form, Button } from "semantic-ui-react";

const AddFactorItem = ({ onClose }) => {
  return (
    <Card>
      <Card.Header>
        <Header className="text-right">افزودن آیتم جدید</Header>
      </Card.Header>
      <Card.Content>
        <Form>
          <Form.Group widths={2}>
            <Form.Input
              className="rtl text-right yekan placeholder-rtl"
              label="کد محصول"
              placeholder="0"
              type="number"
            />
            <Form.Input
              className="rtl text-right yekan placeholder-rtl"
              label="مقدار خریداری شده"
              placeholder="0"
              type="number"
            />
          </Form.Group>
          <Form.Group widths={2}>
            <Form.Input
              className="rtl text-right yekan placeholder-rtl"
              label="تخفیف"
              placeholder="0"
              type="number"
            />
            <Form.Input
              className="rtl text-right yekan placeholder-rtl"
              label="فاکتور"
              placeholder="0"
              type="number"
            />
          </Form.Group>
          <Form.Group widths={2}>
            <Form.Input
              className="rtl text-right yekan placeholder-rtl"
              label="فاکتور"
              placeholder="0"
              type="number"
            />
            <Checkbox
              toggle
              label="ته طاقه"
              className="ltr placeholder-rtl text-right"
            />
          </Form.Group>
          <div className="text-center">
            <Button.Group className="text-yekan text-center">
              <Button onClick={onClose}>بستن</Button>
              <Button.Or text="یا" />
              <Button positive>افزودن</Button>
            </Button.Group>
          </div>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default AddFactorItem;
