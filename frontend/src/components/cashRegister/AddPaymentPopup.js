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
        text: "نقد و کارت",
        value: "cash"
      }
    ],
    kind: null,
    paidPrice: this.props.price
  };

  setStateKind = (_, { value }) => {
    this.setState({ kind: value });
  };

  handleInputChange = e => {
    this.setState({
      paidPrice: e.target.value
    });
  };

  handleSubmit = () => {
    if (this.state.kind === "cheque") {
      this.props.onSubmit(this.state.paidPrice, "چک");
    } else this.props.onSubmit(this.state.paidPrice, "نقد و کارت");
    this.props.onClose();
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
                className="ltr"
                defaultValue={this.props.price}
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
              <h5 className="yekan">
                تاریخ صدور&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="rtl placeholder-rtl text-right yekan"
                placeholder="نمونه:‌ 1398/1/10"
              />
              <h5 className="yekan">
                تاریخ اعتبار&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="rtl placeholder-rtl text-right yekan"
                placeholder="نمونه:‌ 1398/1/10"
              />
            </React.Fragment>
          )}
          {this.state.kind === "cash" && (
            <React.Fragment>
              <h5 className="yekan">
                مبلغ پرداختی کارتی&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </h5>
              <Input
                fluid
                className="ltr"
                type="number"
                defaultValue={this.props.price}
                onChange={e => {
                  this.handleInputChange(e);
                }}
              />
              <h5 className="yekan">مبلغ پرداختی نقدی</h5>
              <Input fluid className="ltr" type="number" defaultValue="0" />
            </React.Fragment>
          )}
        </Card.Content>
        <Card.Content className="ltr text-center">
          <Button.Group>
            <Button className="yekan" onClick={this.props.onClose}>
              بستن
            </Button>
            <Button.Or text="یا" className="yekan" />
            <Button className="yekan" positive onClick={this.handleSubmit}>
              افزودن
            </Button>
          </Button.Group>
        </Card.Content>
      </Card>
    );
  }
}

export default AddPaymentPopup;
