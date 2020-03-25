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
import { priceToPersian, enToFa } from "../utils/numberUtils";

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

  const togglePopupOpen = () => {
    setPopupOpen(!popupOpen);
  };

  const onSubmit = data => {
    setItems([...items, data]);
  };

  useEffect(() => {
    console.log("items", items);
  }, [items]);

  const dispatch = useDispatch();

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
      items: null,
      bill_code: billCode,
      status: _status,
      items
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

  const deleteItem = index => {
    var confirm = window.confirm("آیا از حذف این قلم مطمئن هستید؟");
    if (confirm) {
      for (var i = 0; i < items.length; i++) {
        if (i === index) {
          items.splice(i, 1);
        }
      }
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
              className="rtl text-right placeholder-rtl"
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
            {items
              ? items.map((item, index) => {
                  console.log("map item", item);
                  return (
                    <Card fluid key={index}>
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
                              className="ltr placeholder-rtl text-yekan"
                              readOnly
                              fluid
                              defaultValue={item.name}
                              label="نام محصول"
                            />
                            <Form.Input
                              className="ltr placeholder-rtl"
                              readOnly
                              fluid
                              defaultValue={enToFa(item.code)}
                              label="کد محصول"
                              readOnly
                            />
                            <Form.Input
                              className="ltr placeholder-rtl"
                              readOnly
                              fluid
                              defaultValue={enToFa(item.price)}
                              label="قیمت واحد"
                            />
                            <Form.Input
                              className="ltr placeholder-rtl"
                              readOnly
                              fluid
                              defaultValue={enToFa(item.amount)}
                              label={`مقدار(متر)`}
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
