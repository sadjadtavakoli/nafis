import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Segment,
  Header,
  Divider,
  Popup
} from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { addSupplierFactor } from "../../actions/SuppliersActions";
import AddFactorItem from "./AddFactorItem";

const AddSupplierFactorModal = ({ open, onClose, pk, addCount }) => {
  const [currency, setCurrency] = useState("ریال");
  const [price, setPrice] = useState(0);
  const [billCode, setBillCode] = useState(null);
  const [status, setStatus] = useState("done");
  const [popupOpen, setPopupOpen] = useState(false);

  const options = [
    { text: "ریال", value: "ریال" },
    { text: "دلار", value: "دلار" },
    { text: "روپیه", value: "روپیه" },
    { text: "درهم", value: "درهم" },
    { text: "یوان", value: "یوان" }
  ];

  const statusOptions = [
    { text: "تسویه", value: "done" },
    { text: "عدم تسویه", value: "remained" }
  ];

  const togglePopupOpen = () => {
    setPopupOpen(!popupOpen);
  };

  const dispatch = useDispatch();

  const addFactor = pk => {
    let data = {
      currency,
      currency_price: price,
      items: null,
      bill_code: billCode,
      status
    };
    if (!data.bill_code) {
      alert("شماره فاکتور نمیتواند خالی باشد");
    }
    dispatch(addSupplierFactor(pk, data))
      .then(() => {
        addCount();
        onClose();
      })
      .catch(() => {
        addCount();
        onClose();
      });
  };

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
          <Form.Group unstackable widths={4}>
            <Form.Select
              fluid
              label="نوع ارز"
              options={options}
              defaultValue={currency}
              onChange={e => setCurrency(e.target.textContent)}
            />
            <Form.Input
              className="rtl text-right yekan placeholder-rtl"
              label="قیمت"
              placeholder={price}
              type="number"
              onChange={e => setPrice(e.target.value)}
            />
            <Form.Input
              className="rtl text-right yekan placeholder-rtl"
              label="شماره فاکتور"
              placeholder={"شماره فاکتور"}
              type="number"
              onChange={e => setBillCode(e.target.value)}
            />
            <Form.Select
              fluid
              label="حالت فاکتور"
              options={statusOptions}
              defaultValue={status}
              onChange={e => setStatus(e.target.textContent)}
            />
          </Form.Group>
          <Segment>
            <Header>اقلام</Header>
            <Divider />
            <div className="text-center padded">
              <Popup
                wide="very"
                content={<AddFactorItem onClose={togglePopupOpen} />}
                position="top center"
                open={popupOpen}
                trigger={
                  <Button
                    circular
                    icon="add"
                    color="green"
                    size="huge"
                    onClick={togglePopupOpen}
                  />
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
          onClick={() => addFactor(pk)}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default AddSupplierFactorModal;
