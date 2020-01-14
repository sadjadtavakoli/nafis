import React from "react";
import { Form, Label } from "semantic-ui-react";

const renderField = (obj, key, labelName, customText = undefined) => {
  console.log(obj, key, labelName, customText);
  return (
    <Form.Field>
      <Label>
        {labelName}:{" "}
        {customText && typeof customText === "function"
          ? customText(obj[key])
          : obj[key] || obj[key] === 0
          ? obj[key]
          : "--"}
      </Label>
    </Form.Field>
  );
};

export default renderField;
