import React from "react";
import { Card, Dropdown, Button, Input } from "semantic-ui-react";

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
    ],
    kind: null
  };

  setStateKind = (_, { value }) => {
    this.setState({ kind: value });
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
            onChange={this.setStateKind}
          />
          {this.state.kind === "cheque" && (
            <React.Fragment>
              <h5 className="yekan">
                مبلغ پرداختی&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                type="number"
                fluid
                className="ltr yekan"
                defaultValue={this.props.price}
                placeholder="مبلغ پرداختی"
              />
              <h5 className="yekan">
                شماره چک&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                type="number"
                fluid
                className="rtl placeholder-rtl"
                placeholder="شماره چک"
              />
              <h5 className="yekan">
                بانک&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="rtl placeholder-rtl text-right yekan"
                placeholder="بانک"
              />
            </React.Fragment>
          )}
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
