import React from "react";
import { enToFa, priceToPersian } from "../utils/numberUtils";
import { Button, Form, Card, Popup, Icon, Label } from "semantic-ui-react";

const ItemsRender = ({
  item,
  index,
  editting,
  productData,
  notFound,
  editMode,
  width,
  handleChange,
  handleCodeInputClick,
  cancelChanges,
  deleteItem,
  editItem,
  submitChanges
}) => {
  let [endOfRole, setEndOfRole] = React.useState(item.end_of_roll);

  React.useEffect(() => {
    item.end_of_roll !== endOfRole && setEndOfRole(item.end_of_roll);
  }, [item]);

  return (
    <Card.Group key={index} id="s-showInfromationModel">
      <Card fluid>
        <Card.Content>
          <Card.Header className="yekan">
            <React.Fragment>
              <span>
                {notFound === false ? productData.name : item.product.name}
              </span>
              &nbsp;-&nbsp;
              <span>قیمت واحد</span>
              &nbsp;
              <span id="norm-latin">
                {notFound === false
                  ? priceToPersian(productData.selling_price)
                  : priceToPersian(item.product.selling_price)}
              </span>
              &nbsp;
              <span>تومان</span>
            </React.Fragment>
            {!editMode ? (
              <React.Fragment>
                {width < 425 ? (
                  <React.Fragment>
                    <br />
                    <br />
                  </React.Fragment>
                ) : null}
                <Button
                  icon
                  color="red"
                  onClick={() => deleteItem(index)}
                  className="pointer"
                  labelPosition="right"
                  size="mini"
                  style={{ marginRight: "10px" }}
                >
                  <span>حذف آیتم</span>
                  <Icon name="trash" />
                </Button>
                <Button
                  icon
                  color="teal"
                  onClick={() => editItem(index)}
                  className="pointer"
                  labelPosition="right"
                  size="mini"
                  style={{ marginRight: "10px" }}
                >
                  <span>ویرایش</span>
                  <Icon name="edit" />
                </Button>
              </React.Fragment>
            ) : null}
          </Card.Header>
        </Card.Content>
        <Card.Content>
          <Form>
            <Form.Group widths="equal" unstackable>
              <Popup
                content={
                  <React.Fragment>
                    {notFound === false ? (
                      <Label color="teal" className="rtl text-center">
                        <p>
                          <span>نام محصول:</span>&nbsp;
                          <span>{productData.name}</span>
                        </p>
                        <p>
                          <span>مقدار باقی مانده:</span>&nbsp;
                          <span>{enToFa(productData.stock_amount)}</span>
                          &nbsp;
                          <span>متر</span>
                        </p>
                        <p>
                          <span>قیمت هر متر:</span>&nbsp;
                          <span>
                            {enToFa(priceToPersian(productData.selling_price))}
                          </span>
                          &nbsp;
                          <span>تومان</span>
                        </p>
                      </Label>
                    ) : (
                      <Label color="red">
                        <Icon name="warning circle" />
                        <span>محصول مورد نظر یافت نشد</span>
                      </Label>
                    )}
                  </React.Fragment>
                }
                position="bottom center"
                on="focus"
                trigger={
                  <Form.Input
                    fluid
                    readOnly={true}
                    type="number"
                    className="rtl placeholder-rtl text-right"
                    defaultValue={item.product.code}
                    onChange={e => handleChange(e, "code")}
                    onClick={e => handleCodeInputClick(e)}
                    label="کد محصول"
                  />
                }
              />
              <Form.Input
                className="ltr placeholder-rtl"
                readOnly={editting !== index ? true : false}
                fluid
                defaultValue={item.amount}
                onChange={e => handleChange(e, "amount")}
                label={`مقدار(متر)`}
              />
              <Form.Input
                className="ltr placeholder-rtl"
                readOnly={editting !== index ? true : false}
                fluid
                defaultValue={item.discount}
                onChange={e => handleChange(e, "discount")}
                label="تخفیف"
              />
            </Form.Group>
            <Form.Group unstackable widths={"equal"}>
              <Form.Checkbox
                toggle
                className="ltr placeholder-rtl"
                readOnly={editting !== index ? true : false}
                checked={endOfRole}
                onChange={() => setEndOfRole(e => !e)}
                label="ته طاقه؟"
              />
              <Form.Input
                type="number"
                className="ltr placeholder-rtl"
                readOnly={editting !== index ? true : false}
                defaultValue={item.end_of_roll_amount}
                onChange={e => handleChange(e, "end_of_roll_amount")}
                label="مقدار حساب شده"
                disabled={!endOfRole}
              />
            </Form.Group>
            {editting !== index ? null : (
              <React.Fragment>
                <Button
                  color="green"
                  onClick={() => submitChanges(item.pk, endOfRole)}
                >
                  <span>اعمال</span>
                </Button>
                <Button color="gray" onClick={cancelChanges}>
                  <span>لغو</span>
                </Button>
              </React.Fragment>
            )}
          </Form>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};
export default ItemsRender;
