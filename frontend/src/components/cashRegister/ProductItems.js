import React from "react";
import { Header } from "semantic-ui-react";
import RenderItem from "./RenderItem";

const ProductItems = props => {
  return (
    <div>
      <Header as="h3" textAlign="right">
        <span>اقلام: </span>
      </Header>
      {props.items.map((productItem, index) => (
        <RenderItem productItem={productItem} index={index} />
      ))}
    </div>
  );
};
export default ProductItems;
