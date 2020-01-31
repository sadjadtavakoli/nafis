import React from "react";
import { Header } from "semantic-ui-react";
import RenderItem from "./RenderItem";

const ProductItems = props => {
  return (
    <React.Fragment>
      <Header as="h3" textAlign="right">
        <span>اقلام: </span>
      </Header>
      {props.data.items.map((productItem, index) => (
        <RenderItem productItem={productItem} index={index} />
      ))}
    </React.Fragment>
  );
};
export default ProductItems;
