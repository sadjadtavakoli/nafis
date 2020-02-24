import React from "react";
import { connect } from "react-redux";
import { Button, Tab, Container, Segment, Icon } from "semantic-ui-react";
import { getActiveBill } from "../../actions/SaleActions";
import AddBillModal from "./addBillModal";
import BillTable from "./billTable";
import ProductTable from "../depository/productTable";
import history from "../../history";

const panes = [
  {
    menuItem: "فاکتورهای فعال",
    render: () => (
      <Tab.Pane attached={false}>
        <BillTable />
      </Tab.Pane>
    )
  },
  {
    menuItem: "موجودی محصولات",
    render: () => (
      <Tab.Pane attached={false}>
        <ProductTable edit={false} />
      </Tab.Pane>
    )
  }
];

class Sale extends React.Component {
  componentDidMount() {
    this.props.getActiveBill();
  }

  state = {
    open: false
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <React.Fragment>
        <Container>
          <AddBillModal open={this.state.open} onClose={this.closeModal} />
          <div id="sale">
            <Segment stacked className="rtl">
              <Button
                className="yekan"
                onClick={() => this.setState({ open: true })}
                color="green"
                content="افزودن فاکتور جدید"
                icon="add"
                labelPosition="right"
              />
              <Button
                style={{ float: "left" }}
                onClick={() => history.push("/")}
                color="teal"
                icon="home"
              />
            </Segment>
            <Tab
              renderActiveOnly={true}
              menu={{ pointing: true }}
              panes={panes}
            />
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

export default connect(null, { getActiveBill })(Sale);
