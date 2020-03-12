import React from "react";
import { Label, Grid } from "semantic-ui-react";

let TableLabel = props => {
  return (
    <Grid className={"ltr"}>
      <Grid.Column
        floated="left"
        mobile={10}
        computer={15}
        className={"text-right"}
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
