import React from "react";
import {Router, Route} from "react-router-dom";
import {connect} from "react-redux";

import "../scss/normalize.css";

import history from "../history";
import mainPage from "./mainPage";
// import Dashboard from "../dashboard";
// import Receipt from "../receipt";
// import Depository from "../depository";
// import Providers from "../providers";
// import ProviderProfile from "../providerProfile";
// import Customers from "../customers";
// import AddCustomer from "../addCustomer";
// import CustomerProfile from "../customerProfile";
// import Reports from "../reports";
// import editProduct from "../editProduct";
// import PrintFactor from '../printFactor';
// import addProvider from "../addProvider";
// import editProvider from "../editProvider";
// import editCustomer from "../editCustomer";
// import CashRegister from "../cashRegister";
// import NavBar from "../navbar";
// import FlexDummy from "../basic/flexDummy";
import Login from "./auth/login";
// import DailyStats from '../dailyStats';
// import Notificaitons from '../notifications';
// import ProviderStats from '../providerStats';

const App = (props) => {
  console.log(props);
    return (
        <div className="App__container">
            {props.token ? (
                <>
                    <Router history={history}>
                        {/* <NavBar/> */}
                        <Route path="/" exact component={mainPage}/>
                        {/* <Route path="/dashboard" exact component={Dashboard}/>
                        <Route path="/receipt/:id" exact component={Receipt}/>
                        <Route path="/depository" exact component={Depository}/>
                        <Route path="/providers" exact component={Providers}/>
                        <Route path="/providers/:id" exact component={ProviderProfile}/>
                        <Route path="/customers" exact component={Customers}/>
                        <Route path="/addCustomers" exact component={AddCustomer}/>
                        <Route path="/customers/:id" exact component={CustomerProfile}/>
                        <Route path="/reports" exact component={Reports}/>
                        <Route path="/products/:id" exact component={editProduct}/>
                        <Route path="/printFactor/:id" exact component={PrintFactor} />
                        <Route path="/addProvider" exact component={addProvider}/>
                        <Route path="/providers/:id/edit" exact component={editProvider}/>
                        <Route path="/customers/:id/edit" exact component={editCustomer}/>
                        <Route path="/cashregister" exact component={CashRegister}/>
                        <Route path="/cashregister/stats" exact component={DailyStats} />
                        <Route path="/notifications" exact component={Notificaitons} />
                        <Route path="/providerStats" exact component={ProviderStats} /> */}
                    </Router>
                    {/* <FlexDummy direction="bottom"/> */}
                </>
            ) : (
                <Login/>
            )}
        </div>
    );
};

const mapStateToProps = state => {
    if (localStorage.getItem('token')) {
        return {type: localStorage.getItem('type'), user: localStorage.getItem('user'), token: localStorage.getItem('token')}
    }
    // return {type: state.auth.type, user: state.auth.currentUser, token: state.auth.token};
    return {type: null, user: null, token: null};
};

export default connect(mapStateToProps)(App);
