import React from "react";
// import animejs from "animejs";
import { connect } from "react-redux";
import { Icon, Menu, Segment, Sidebar, Button } from "semantic-ui-react";
import history from "../../history";
import { logOut } from "../../actions/LoginActions";
import HomeButton from "../utils/HomeButton";
import { isPermit } from "../mainPage/permission";
import userAvatar from "../../assets/user-avatar.png";
class SideBar extends React.Component {
  state = {
    visible: false,
    userData: JSON.parse(localStorage.getItem("user")),
    height: 0
  };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.setJob();
  }

  componentWillReceiveProps() {
    this.setJob();
  }

  setJob = () => {
    this.setState({ job: localStorage.getItem("type") });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ height: window.innerHeight });
  };

  logOut = () => {
    var r = window.confirm("آیا برای خروج از سامانه مطمئن هستید؟");
    if (r == true) {
      this.props.logOut();
    }
  };

  goTo = page => {
    history.push(page);
    this.setState({ visible: false });
  };

  setVisible = visible => {
    this.setState({ visible });
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    return (
      <div id="sidebar">
        <div className="navbar hidden-print">
          <Menu secondary>
            <Menu.Menu position="left">
              <Menu.Item
                onClick={() => this.setVisible(!this.state.visible)}
                icon="bars"
              />
              <Menu.Item fitted={true} onClick={this.logOut}>
                <Button
                  icon="sign-out"
                  labelPosition="left"
                  content="خروج"
                  className="yekan"
                />
              </Menu.Item>
              <Menu.Item fitted={true}>
                <HomeButton />
              </Menu.Item>
            </Menu.Menu>
            <Menu.Menu position="right">
              <Menu.Item style={{ padding: 0 }}>
                {this.state.userData.first_name +
                  " " +
                  this.state.userData.last_name}
              </Menu.Item>
              <Menu.Item style={{ paddingLeft: 0 }}>
                <img src={userAvatar} />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </div>
        <Sidebar.Pushable as={Segment} style={{ height: this.state.height }}>
          <Sidebar
            as={Menu}
            animation="scale down"
            icon="labeled"
            inverted
            onHide={() => this.setVisible(false)}
            vertical
            visible={this.state.visible}
            width="thin"
          >
            <Menu.Item
              onClick={() => {
                this.goTo("/");
              }}
              as="a"
            >
              <Icon name="home" />
              <span>پیشخوان</span>
            </Menu.Item>
            {isPermit("sale", this.state.job) ? (
              <Menu.Item
                onClick={() => {
                  this.goTo("/sale/");
                }}
                as="a"
              >
                <Icon name="money bill alternate" />
                <span>فروش</span>
              </Menu.Item>
            ) : null}
            {isPermit("cashregister", this.state.job) ? (
              <Menu.Item
                onClick={() => {
                  this.goTo("/cashregister/");
                }}
                as="a"
              >
                <Icon name="fax" />
                <span>صندوق</span>
              </Menu.Item>
            ) : null}
            {isPermit("depository", this.state.job) ? (
              <Menu.Item
                onClick={() => {
                  this.goTo("/depository/");
                }}
                as="a"
              >
                <Icon name="factory" />
                <span>انبارداری</span>
              </Menu.Item>
            ) : null}
            {isPermit("reports", this.state.job) ? (
              <Menu.Item
                onClick={() => {
                  this.goTo("/reports/");
                }}
                as="a"
              >
                <Icon name="chart pie" />
                <span>گزارشات</span>
              </Menu.Item>
            ) : null}
            {isPermit("customers", this.state.job) ? (
              <Menu.Item
                onClick={() => {
                  this.goTo("/customers/");
                }}
                as="a"
              >
                <Icon name="users" />
                <span>مشتریان</span>
              </Menu.Item>
            ) : null}
            {isPermit("suppliers", this.state.job) ? (
              <Menu.Item
                onClick={() => {
                  this.goTo("/suppliers/");
                }}
                as="a"
              >
                <Icon name="truck" />
                <span>تامین کنندگان</span>
              </Menu.Item>
            ) : null}
          </Sidebar>

          <Sidebar.Pusher>
            <Segment original="" disabled={this.state.visible}>
              {this.props.children}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser
      ? state.auth.currentUser
      : localStorage.getItem("user"),
    type: state.auth.type ? state.auth.type : localStorage.getItem("type")
  };
};

export default connect(mapStateToProps, { logOut })(SideBar);
