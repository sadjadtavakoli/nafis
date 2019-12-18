import React from "react";
import { Form, Popup, Button, Label, Divider, Card } from "semantic-ui-react";
import renderField from "./RenderField";
import { priceToPersian, enToFa } from "../utils/numberUtils";
import { useToggle } from "../../utils/Hooks";

const RenderItem = props => {
  const [productInfoIsOpen, toggleProductInfoIsOpen] = useToggle(false);
  return (
    <div>
      <Form.Group
        className="rtl"
        widths="4"
        key={`bill_productItem_${props.index}`}
      >
        {renderField(props.productItem, "pk", "کد قلم", enToFa)}
        <Form.Field>
          <Popup
            content={
              <Product
                product={props.productItem.product}
                onClose={toggleProductInfoIsOpen}
              />
            }
            style={{ top: -100 }}
            open={productInfoIsOpen}
            className="no-filter"
            position="bottom center"
            wide="very"
            trigger={
              <Label
                onClick={toggleProductInfoIsOpen}
                color="blue"
                icon="info"
                as="a"
              >
                نمایش محصول
              </Label>
            }
          />
        </Form.Field>
        {renderField(
          props.productItem.product,
          "selling_price",
          "قیمت واحد فروش",
          priceToPersian
        )}
        {renderField(props.productItem, "amount", "متراژ", enToFa)}
      </Form.Group>
      <Form.Group widths="4">
        {renderField(props.productItem, "end_of_roll", "ته طاقه", roll => {
          return roll
            ? `هست (${enToFa(props.productItem.end_of_roll_amount)} متر)`
            : "نیست";
        })}
        {renderField(
          props.productItem,
          "discount",
          "تخفیف قلم",
          priceToPersian
        )}
        {renderField(props.productItem, "price", "مبلغ", priceToPersian)}
        {renderField(
          props.productItem,
          "final_price",
          "مبلغ نهایی",
          priceToPersian
        )}
      </Form.Group>
      <Divider />
    </div>
  );
};

const Product = props => {
  return (
    <Card className="rtl">
      <Card.Content>
        <Card.Header className="yekan">مشخصات محصول</Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Form>
          {renderField(props.product, "code", "کد محصول", enToFa)}
          {renderField(props.product, "name", "نام")}
          {renderField(props.product, "branch", "کد شعبه", enToFa)}
          {renderField(
            props.product,
            "background_color",
            "کد رنگ پس زمینه",
            enToFa
          )}
          {renderField(props.product, "design_color", "کد رنگ طرح", enToFa)}
          {renderField(props.product, "material", "کد جنس", enToFa)}
          {renderField(props.product, "f_type", "کد نوع پارچه", enToFa)}
          {renderField(props.product, "design", "کد نوع طرح", enToFa)}
          {renderField(
            props.product,
            "selling_price",
            "قیمت واحد فروش",
            priceToPersian
          )}
          {renderField(
            props.product,
            "buying_price",
            "قیمت خرید",
            priceToPersian
          )}
          {renderField(props.product, "stock_amount", "تعداد موجود", enToFa)}
          <div className="text-center">
            <Button.Group className="ltr">
              <Button className="yekan" color="black" onClick={props.onClose}>
                بستن
              </Button>
            </Button.Group>
          </div>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default RenderItem;
