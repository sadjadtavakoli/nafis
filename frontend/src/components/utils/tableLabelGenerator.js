import React from "react";
import { Label, Grid } from "semantic-ui-react";

let TableLabel = props => {
  return (
    <Grid className="ltr">
      <Grid.Column
        floated="left"
        mobile={10}
        computer={15}
        style={{ padding: "0.25em", margin: "auto" }}
      >
        {props.children}
      </Grid.Column>
      <Grid.Column floated="right" mobile={5} className="only-device">
        <Label className={"only-device d-flex m-1 norm-latin"}>
          <span>{props.count}</span>
        </Label>
      </Grid.Column>
    </Grid>
  );
};

export default TableLabel;
