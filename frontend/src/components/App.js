import React from "react";
import {Router, Route} from "react-router-dom";
import {connect} from "react-redux";

import 'semantic-ui-css/semantic.min.css'
import "../scss/global.scss";

import history from "../history";
import SideBar from "./sideBar";
import Sale from "./sale";
import mainPage from "./mainPage";
import Depository from "./depository";
// import Dashboard from "../dashboard";
// import Receipt from "../receipt";
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

class App extends React.Component {
    render(){
        return (
            <div className="App__container">
                {this.props.token ? (
                    <>
                        <Router history={history}>
                            {/* <NavBar/> */}
                            <SideBar>
                                <Route path="/" exact component={mainPage} />
                                <Route path="/sale" exact component={Sale}/>
                                <Route path="/depository" exact component={Depository}/>
                                {/* 
                        <Route path="/receipt/:id" exact component={Receipt}/>
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
                            </SideBar>
                        </Router>
                        {/* <FlexDummy direction="bottom"/> */}
                    </>
                ) : (
                        <Login />
                    )}
            </div>
        );
    }
};

const mapStateToProps = state => {
    console.log('state',state)
    if (localStorage.getItem('token')) {
        return {type: localStorage.getItem('type')+'XXXXXXX', user: localStorage.getItem('user'), token: localStorage.getItem('token')}
    }
    // return {type: state.auth.type, user: state.auth.currentUser, token: state.auth.token};
    return {type: null, user: null, token: null};
};

export default connect(mapStateToProps)(App);
