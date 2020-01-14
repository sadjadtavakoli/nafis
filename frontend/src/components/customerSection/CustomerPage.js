import React, { Component } from "react";
import { Tab } from "semantic-ui-react";

import ChequeTab from "./ChequeTab";
import EditTab from "./EditTab";
import FactorsTab from "./FactorsTab";

const panes = pk => [
  {
    menuItem: "پروفایل",
    render: () => (
      <Tab.Pane attached={false}>
        <EditTab passingPk={pk} />
      </Tab.Pane>
    )
  },
  {
    menuItem: "فاکتورها",
    render: () => (
      <Tab.Pane attached={false}>
        <FactorsTab passingPk={pk} />
      </Tab.Pane>
    )
  },
  {
    menuItem: "چک ها",
    render: () => (
      <Tab.Pane attached={false}>
        <ChequeTab passingPk={pk} />
      </Tab.Pane>
    )
  }
];

class CustomerPage extends Component {
  render() {
    return (
      <div className="rtl" style={{ width: "1130px", margin: "0 auto" }}>
        <Tab
          menu={{ pointing: true }}
          panes={panes(this.props.match.params.pk)}
        />
      </div>
    );
  }
}

export default CustomerPage;
