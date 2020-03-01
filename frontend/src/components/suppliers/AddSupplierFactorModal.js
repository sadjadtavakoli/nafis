import React from "react";
import {
  Modal,
  Button,
  Form,
  Segment,
  Header,
  Divider,
  Popup,
  Card
} from "semantic-ui-react";

const AddSupplierFactorModal = ({ open, onClose }) => {
  const options = [
    { text: "تومان", value: "toman" },
    { text: "دلار", value: "dollor" },
    { text: "درهم", value: "derham" }
  ];

  return (
    <Modal
      dimmer={"blurring"}
      open={open}
      onClose={onClose}
      className="text-right"
    >
      <Modal.Header>ثبت فاکتور جدید</Modal.Header>

      <Modal.Content>
        <Form className="rtl">
          <Form.Group unstackable widths={2}>
            <Form.Select
              fluid
              label="نوع ارز"
              options={options}
              defaultValue={"toman"}
            />
            <Form.Input
              className="rtl text-right yekan placeholder-rtl"
              label="قیمت"
              placeholder="0"
              type="number"
            />
          </Form.Group>
          <Segment>
            <Header>اقلام</Header>
            <Divider />
            <div className="text-center padded">
              <Popup
                pinned
                content={
                  <Card>
                    <Card.Header>
                      <Header className="text-right">افزودن آیتم جدید</Header>
                    </Card.Header>
                    <Card.Content>
                      <Form>
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
                        <Form.Input
                          className="rtl text-right yekan placeholder-rtl"
                          label="قیمت"
                          placeholder="0"
                          type="number"
                        />
                        <div className="text-center">
                          <Button.Group className="text-yekan text-center">
                            <Button>بستن</Button>
                            <Button.Or text="یا" />
                            <Button positive>افزودن</Button>
                          </Button.Group>
                        </div>
                      </Form>
                    </Card.Content>
                  </Card>
                }
                on="click"
                position="top center"
                trigger={
                  <Button circular icon="plus" color="green" size="huge" />
                }
              />
            </div>
          </Segment>
        </Form>
      </Modal.Content>

      <Modal.Actions>
        <Button color="black" onClick={onClose} className="yekan">
          لغو
        </Button>
        <Button
          positive
          icon="checkmark"
          labelPosition="right"
          content="تایید"
          className="yekan"
        />
      </Modal.Actions>
    </Modal>
  );
};

export default AddSupplierFactorModal;
