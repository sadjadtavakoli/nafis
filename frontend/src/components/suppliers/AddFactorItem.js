import React, { useState } from "react";
import { Card, Header, Form, Button, Label, Icon } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import { getProductsByCode } from "../../actions/SuppliersActions";
import { enToFa } from "../utils/numberUtils";

const AddFactorItem = ({ onClose, onSubmit, pk }) => {
  const [fetch, setFecth] = useState(false);
  const [code, setCode] = useState(null);
  const [amount, setAmount] = useState(null);
  const [price, setPrice] = useState(null);
  const [notFound, setNotFound] = useState(true);

  const product = useSelector(state => state.suppliers.product);
  const dispatch = useDispatch();

  const handleCodeChange = e => {
    let value = e.target.value;
    setCode(value);
    if (value) {
      dispatch(getProductsByCode(value))
        .then(() => {
          setFecth(true);
          setNotFound(false);
        })
        .catch(() => {
          setFecth(true);
          setNotFound(true);
        });
    } else {
      setFecth(false);
      setNotFound(true);
    }
  };

  const submit = () => {
    if (!code) {
      alert("کد محصول نمیتواند خالی باشد.");
    } else {
      let data = {
        product: Number(product.code),
        amount: Number(amount),
        price: Number(price),
        bill: pk
      };
      onSubmit(data);
      onClose();
    }
  };

  return (
    <Card>
      <Card.Header>
        <Header className="text-right">
          <h3
            className="yekan d-flex"
            style={{
              alignItems: "center",
              marginBottom: 0,
              justifyContent: "flex-end"
            }}
          >
            افزودن آیتم جدید
          </h3>
        </Header>
      </Card.Header>
      <Card.Content>
        {fetch && !notFound ? (
          <div className="text-center" style={{ marginBottom: "10px" }}>
            <Label color="teal">
              <p>
                <span>نام محصول:</span>&nbsp;
                <span>{product.name}</span>
              </p>
              <p>
                <span>مقدار باقی مانده:</span>&nbsp;
                <span>{enToFa(product.stock_amount)}</span>&nbsp;
                <span>متر</span>
              </p>
              <p>
                <span>قیمت هر متر:</span>&nbsp;
                <span>{enToFa(product.selling_price)}</span>
                &nbsp;
                <span>تومان</span>
              </p>
            </Label>
          </div>
        ) : null}
        {fetch && notFound ? (
          <div className="text-center" style={{ marginBottom: "10px" }}>
            <Label color="red">
              <Icon name="warning circle" />
              <span>محصول مورد نظر یافت نشد</span>
            </Label>
          </div>
        ) : null}
        <Form>
          <Form.Group widths={2}>
            <Form.Input
              label="مقدار خریداری شده"
              type="number"
              min={0}
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <Form.Input
              label="کد محصول"
              type="number"
              value={code}
              min={1}
              onChange={e => handleCodeChange(e)}
            />
          </Form.Group>
          <Form.Group widths={2}>
            <Form.Input
              label="قیمت خام"
              type="number"
              min={0}
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </Form.Group>
          <div className="text-center">
            <Button.Group className="text-yekan text-center">
              <Button onClick={onClose}>بستن</Button>
              <Button.Or text="یا" />
              <Button positive onClick={submit} disabled={notFound}>
                افزودن
              </Button>
            </Button.Group>
          </div>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default AddFactorItem;
