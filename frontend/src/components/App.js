import React from "react";
import { Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import "semantic-ui-css/semantic.min.css";
import "../scss/global.scss";

import history from "../history";
import SideBar from "./sideBar";
import Sale from "./sale";
import mainPage from "./mainPage";
import Depository from "./depository";
import CashRegister from "./cashRegister";
import PrintableFactor from "./factor";
import Login from "./auth/login";
import DailyReport from "./cashRegister/DailyReport";
import Reports from "./reports";
import Customers from "./customerSection";
import CustomerPage from "./customerSection/CustomerPage";
import Suppliers from "./suppliers";
import Supplier from "./suppliers/Supplier";
import DepositoryEdit from "./depository/depositoryEdit";
import ViewBill from "./cashRegister/ViewBill";

const App = ({ token }) => {
  return (
    <div className="App__container">
      {token ? (
        <Router history={history}>
          <SideBar>
            <Route path="/" exact component={mainPage} />
            <Route path="/sale/" exact component={Sale} />
            <Route path="/depository/" exact component={Depository} />
            <Route path="/cashregister/" exact component={CashRegister} />
            <Route
              path="/factor/:id/:print/"
              exact
              component={PrintableFactor}
            />
            <Route path="/daily-report/" exact component={DailyReport} />
            <Route path="/reports/" exact component={Reports} />
            <Route path="/customers/" exact component={Customers} />
            <Route
              path="/customers/customer/:pk/"
              exact
              component={CustomerPage}
            />
            <Route path="/suppliers/" exact component={Suppliers} />
            <Route path="/suppliers/supplier/:pk/" exact component={Supplier} />
            <Route
              path="/depository/depository-edit/:code/:pk/"
              exact
              component={DepositoryEdit}
            />
            <Route path="/cashregister/:pk" exact component={ViewBill} />
          </SideBar>
        </Router>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default connect(state => ({ token: state.auth.token }), null)(App);
