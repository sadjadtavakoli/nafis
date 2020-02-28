import React from "react";
import history from "../../history";
import { Button } from "semantic-ui-react";

let RepeatButton = props => {
  return (
    <Button
      className="yekan"
      labelPosition="right"
      content="بروزرسانی"
      icon="repeat"
      onClick={props.onClick}
    />
  );
};

export default RepeatButton;
