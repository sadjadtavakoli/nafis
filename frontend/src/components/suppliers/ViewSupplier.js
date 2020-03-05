import React, { useState } from "react";
import { Tab, Container, Segment, Grid } from "semantic-ui-react";
import EditSupplier from "./EditSupplier";
import SupplierFactor from "./SupplierFactor";
import BackButton from "../utils/BackButton";

const ViewSupplier = React.memo(() => {
  
  const panes = [
    {
      menuItem: "ویرایش",
      render: () => <EditSupplier />
    },
    {
      menuItem: "فاکتور ها",
      render: () => (
        <SupplierFactor pk={Number(window.location.href.split("/")[5])} />
      )
    }
  ];
  return (
    <Container>
      <Segment stacked className="rtl">
        <Grid>
          <Grid.Column verticalAlign="middle" width={5}>
            <h2 className="yekan s-h2-padding">تامین کنندگان</h2>
          </Grid.Column>
          <Grid.Column verticalAlign="middle" floated="left">
            <BackButton />
          </Grid.Column>
        </Grid>
      </Segment>
      <Tab
        menu={{ secondary: true, pointing: true }}
        panes={panes}
        defaultActiveIndex={1}
      />
    </Container>
  );
});

export default ViewSupplier;
