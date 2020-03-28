import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Segment,
  Header,
  Divider,
  Popup,
  Card,
  Label,
  Icon,
  Message
} from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { addSupplierFactor } from "../../actions/SuppliersActions";
import AddFactorItem from "./AddFactorItem";

const AddSupplierFactorModal = ({ open, onClose, pk, addCount }) => {
  const [currency, setCurrency] = useState("تومان");
  const [price, setPrice] = useState(1);
  const [billCode, setBillCode] = useState(null);
  const [status, setStatus] = useState("تسویه");
  const [popupOpen, setPopupOpen] = useState(false);
  const [items, setItems] = useState([]);

  const options = [
    { text: "تومان", value: "تومان" },
    { text: "دلار", value: "دلار" },
    { text: "روپیه", value: "روپیه" },
    { text: "درهم", value: "درهم" },
    { text: "یوان", value: "یوان" }
  ];

  const statusOptions = [
    { text: "تسویه", value: "تسویه" },
    { text: "عدم تسویه", value: "عدم تسویه" }
  ];

  const dispatch = useDispatch();

  const togglePopupOpen = () => {
    setPopupOpen(!popupOpen);
  };

  const onSubmit = data => {
    setItems([...items, data]);
  };

  const addFactor = pk => {
    let _status = null;
    if (status === "تسویه") {
      _status = "done";
    } else {
      _status = "remained";
    }

    let data = {
      currency,
      currency_price: price,
      bill_code: billCode,
      status: _status,
      items
    };

    if (!data.bill_code) {
      alert("شماره فاکتور نمیتواند خالی باشد");
    } else {
      dispatch(addSupplierFactor(pk, data))
        .then(() => {
          addCount();
          onClose();
        })
        .catch(() => {
          addCount();
          onClose();
        });
    }
  };

  const deleteItem = index => {
    let i = window.confirm("آیا از حذف این آیتم مطمئن هستید؟");
    if (i) {
      setItems(items.filter((_, _index) => _index !== index));
    }
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
              className="rtl text-right"
              id="norm-latin"
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
                content={
                  <AddFactorItem
                    onClose={togglePopupOpen}
                    onSubmit={onSubmit}
                  />
                }
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

            {Number(items.length)
              ? items.map((item, index) => {
                  return (
                    <Card fluid>
                      <Card.Content>
                        <Card.Header className="yekan">
                          {item.name}
                          <span>
                            <Label
                              color="red"
                              onClick={() => deleteItem(index)}
                              className="pointer"
                              style={{ marginRight: 10 }}
                            >
                              <Icon name="trash" /> حذف آیتم
                            </Label>
                          </span>
                        </Card.Header>
                        <Card.Description className="yekan">
                          <Message compact size="mini" color="teal">
                            داده های زیر صرفا جهت خواندن هستن و برای جلوگیری از
                            اشتباهات انسانی قابل تغییر نمی باشند.{" "}
                          </Message>
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <Form>
                          <Form.Group widths="equal">
                            <Form.Input
                              className="rtl placeholder-rtl"
                              fluid
                              value={item.product}
                              label="کد محصول"
                              type="number"
                              readOnly
                            />
                            <Form.Input
                              className="rtl placeholder-rtl"
                              fluid
                              value={item.price}
                              label="قیمت واحد"
                              type="number"
                              readOnly
                            />
                            <Form.Input
                              className="rtl placeholder-rtl"
                              fluid
                              value={item.amount}
                              label={`مقدار(متر)`}
                              type="number"
                              readOnly
                            />
                          </Form.Group>
                        </Form>
                      </Card.Content>
                    </Card>
                  );
                })
              : null}
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
