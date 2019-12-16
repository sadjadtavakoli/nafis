import React, { useState, useEffect } from "react";
import { Header, Form, Popup, Button } from "semantic-ui-react";
import renderField from "./RenderField";
import { enToFa } from "../utils/numberUtils";
import RenderItem from "./RenderItem";

const ProductItems = props => {
  return (
    <>
      <Header as="h3" textAlign="right">
        <span>اقلام: </span>
      </Header>
      {props.items.map((productItem, index) => (
        <RenderItem productItem={productItem} index={index} />
      ))}
    </>
  );
};
export default ProductItems;
