import React from "react";
import { Button } from "semantic-ui-react";

const BackButton = () => {
  return (
    <Button
      circular
      icon="arrow left"
      size="large"
      onClick={() => {
        window.history.back();
      }}
    />
  );
};

export default BackButton;
