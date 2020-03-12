import React, { useState, useEffect } from "react";
import { Card, Header, Form, Button, Label } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import { getProductsByCode } from "../../actions/SuppliersActions";
import { enToFa } from "../utils/numberUtils";

const AddFactorItem = ({ onClose, onSubmit, pk }) => {
  const [fetch, setFecth] = useState(false);
  const [code, setCode] = useState(null);
  const [amount, setAmount] = useState(null);
  const [rawPrice, setRawPrice] = useState(null);
  const [rejected, setRejected] = useState(false);

  const product = useSelector(state => state.suppliers.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductsByCode(code)).then(() => setFecth(true));
  }, [code]);

  const submit = () => {
    if (!code) {
      alert("کد محصول نمیتواند خالی باشد.");
    } else {
      let data = {
        name: product.name,
        product: Number(product.code),
        selling_price: Number(product.selling_price),
        amount: Number(amount),
        price: Number(rawPrice),
        rejected,
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
        {fetch ? (
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
              onChange={e => setCode(e.target.value)}
            />
          </Form.Group>
          <Form.Group widths={2}>
            <Form.Input
              label="قیمت خام"
              type="number"
              min={0}
              value={rawPrice}
              onChange={e => setRawPrice(e.target.value)}
            />
            <Form.Radio
              toggle
              label="مرجوع"
              value={rejected}
              onChange={() => setRejected(!rejected)}
            />
          </Form.Group>
          <div className="text-center">
            <Button.Group className="text-yekan text-center">
              <Button onClick={onClose}>بستن</Button>
              <Button.Or text="یا" />
              <Button positive onClick={submit}>
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
