import React from "react";
// import animejs from "animejs";
import { connect } from "react-redux";
import { Header, Icon, Input, Menu, Segment, Sidebar, Button } from 'semantic-ui-react'
import history from "../../history";
import {logOut} from "../../actions/LoginActions";
let userData = JSON.parse(localStorage.getItem('user'))
class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
    state = { visible: false,width: 0, height: 0 }
    
    logOut = () => {
        this.props.logOut();
    };
    goTo = (page) => {
        history.push(page);
        this.setState({ visible: false });
    }
    setVisible = (visible) => {
        this.setState({ visible })
    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {

        return (
            <div id="sidebar">
                <div className="navbar">
                    <Menu secondary>
                        <Menu.Menu position='left'>
                            <Menu.Item
                                onClick={() => this.setVisible(!this.state.visible)}
                                icon='bars'
                            />
                            <Menu.Item
                                fitted={true}
                                onClick={this.logOut}
                            >
                                    <Button icon labelPosition='left'>
                                    <span>خروج</span>
                                    <Icon name='sign-out' />
                                    </Button>
                            </Menu.Item>
                        </Menu.Menu>
                        <Menu.Menu position='right'>
                            <Menu.Item style={{paddingRight: 0}}>{userData.first_name+' '+userData.last_name}</Menu.Item>
                            <Menu.Item style={{paddingLeft: 0}}>
                                <img src='https://react.semantic-ui.com/logo.png' />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                </div>
                <Sidebar.Pushable as={Segment} style={{ height: this.state.height }}>
                    <Sidebar
                        as={Menu}
                        animation='scale down'
                        icon='labeled'
                        inverted
                        onHide={() => this.setVisible(false)}
                        vertical
                        visible={this.state.visible}
                        width='thin'
                    >
                        <Menu.Item onClick={() => { this.goTo('/') }}as='a'>
                            <Icon name='home' />
                            <span>پیشخوان</span>
                    </Menu.Item>
                        <Menu.Item onClick={()=>{this.goTo('/sale/')}} as='a'>
                            <Icon name='money bill alternate' />
                            <span>فروش</span>
                    </Menu.Item>
                    <Menu.Item onClick={()=>{this.goTo('/cashregister/')}} as='a'>
                            <Icon name='fax' />
                            <span>صندوق</span>
                    </Menu.Item>
                    <Menu.Item onClick={()=>{this.goTo('/depository/')}} as='a'>
                            <Icon name='factory' />
                            <span>انبارداری</span>
                    </Menu.Item>
                    </Sidebar>

                    <Sidebar.Pusher>
                        <Segment disabled={this.state.visible}>

                            {this.props.children}

                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        );
  }
}

// const mapStateToProps = state => {
//   return {
//     nextReceipt: state.receipts.nextReceipt,
//     currentUser: state.auth.currentUser
//       ? state.auth.currentUser
//       : localStorage.getItem("user")
//       ? localStorage.getItem("user")
//       : "",
//     type: state.auth.type
//       ? state.auth.type
//       : localStorage.getItem("type")
//       ? localStorage.getItem("type")
//       : ""
//   };
// };

export default connect(
    null,
    {logOut}
//   mapStateToProps,
//   { initReceipt,navBarDisplay }
)(SideBar);
