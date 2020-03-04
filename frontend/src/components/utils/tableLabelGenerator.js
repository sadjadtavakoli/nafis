import React from "react";
import { Label } from "semantic-ui-react";

let TableLabel = props => {
  return (
    <Label className={"only-device d-flex m-1 norm-latin"}>
      <span>{props.children}</span>
    </Label>
  );
};

export default TableLabel;
