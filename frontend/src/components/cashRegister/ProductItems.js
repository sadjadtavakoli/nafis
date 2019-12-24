import React from "react";
import { Header, Label } from "semantic-ui-react";
import RenderItem from "./RenderItem";
import {enToFa,priceToPersian} from '../utils/numberUtils'
const ProductItems = props => {
  return (
    <React.Fragment>
      <Header as="h3" textAlign="right">
          <span>اقلام: </span>
        <Label color="teal">
          <span>تخفیف کلی اقلام: </span><span>{enToFa(priceToPersian(props.data.total_discount))} تومان</span>
        </Label>
      </Header>
      {props.data.items.map((productItem, index) => (
        <RenderItem productItem={productItem} index={index} />
      ))}
    </React.Fragment>
  );
};
export default ProductItems;
