import React from "react";
import { Container, Segment, Button } from "semantic-ui-react";
import history from "../../history";
import CashregisterTable from "./CashRegisterTable";
import HomeButton from "../HomeButton";

class Cashregister extends React.Component {
  render() {
    return (
      <Container>
        <Segment stacked className="rtl">
          <Button
            className="yellow"
            onClick={() => history.push("/daily-report/")}
            color="teal"
            content="مشاهده گزارش روزانه"
            icon="print"
            labelPosition="right"
            className="yekan"
            onClick={() => {
              history.push("/daily-report/");
            }}
          />
          <HomeButton />
        </Segment>

        <CashregisterTable />
      </Container>
    );
  }
}

export default Cashregister;
