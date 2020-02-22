import React from "react";
import { Card, Dropdown, Button } from "semantic-ui-react";

class AddPaymentPopup extends React.Component {
  state = {
    paymentOptions: [
      {
        key: "cheque",
        text: "چک",
        value: "cheque"
      },
      {
        key: "cash",
        text: "نفد و کارت",
        value: "cash"
      }
    ]
  };

  render() {
    return (
      <Card className="rtl" key={0}>
        <Card.Content>
          <Card.Header className="d-flex">
            <h3
              className="yekan d-flex"
              style={{ alignItems: "center", marginBottom: 0 }}
            >
              افزودن پرداخت جدید
            </h3>
          </Card.Header>
        </Card.Content>
        <Card.Content>
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
          />
        </Card.Content>
        <Card.Content className="ltr text-center">
          <Button.Group>
            <Button className="yekan" onClick={this.props.onClose}>
              بستن
            </Button>
            <Button.Or text="یا" className="yekan" />
            <Button className="yekan" positive>
              افزودن
            </Button>
          </Button.Group>
        </Card.Content>
      </Card>
    );
  }
}

export default AddPaymentPopup;
