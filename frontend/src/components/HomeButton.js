import React from "react";
import history from "../history";
import { Button } from "semantic-ui-react";

let HomeButton = () => {
  return (
    <Button
      style={{ float: "left" }}
      onClick={() => history.push("/")}
      color="teal"
      icon="home"
    />
  );
};

export default HomeButton;
