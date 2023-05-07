import React from "react";
import { connect } from "react-redux";
import { Card, Header, Icon, Segment } from "semantic-ui-react";
import history from "../../history";
import { isPermit } from "./permission";
class MainPage extends React.Component {
  state = { showModal: false, modalInput: "", width: 0 };
  componentWillReceiveProps() {
    this.forceUpdate();
    this.setJob();
  }
  componentDidMount() {
    this.setJob();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }
  setJob = () => {
    this.setState({ job: localStorage.getItem("type") });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  };
  render() {
    return (
      <div className="main-page__container">
        <div className="main-page__items-container">
          <Segment placeholder>
            <Header>
              <Card.Group
                itemsPerRow={this.state.width < 768 ? 16 : 6}
                className="rtl padded"
              >
                {isPermit("sale", this.state.job) ? (
                  <Card
                    raised
                    className="p-5 pointer tale"
                    onClick={() => history.push("/sale/")}
                  >
                    <Icon
                      size="huge"
                      className="m-auto w-100"
                      name="money bill alternate"
                    />
                    <h2 className="text-black yekan text-center">فروش</h2>
                  </Card>
                ) : null}

                {isPermit("cashregister", this.state.job) ? (
                  <Card
                    raised
                    className="p-5 pointer tale"
                    onClick={() => history.push("/cashregister/")}
                  >
                    <Icon size="huge" className="m-auto w-100" name="fax" />
                    <h2 className="text-black yekan text-center">صندوق</h2>
                  </Card>
                ) : null}

                {isPermit("depository", this.state.job) ? (
                  <Card
                    raised
                    className="p-5 pointer tale"
                    onClick={() => history.push("/depository/")}
                  >
                    <Icon size="huge" className="m-auto w-100" name="factory" />
                    <h2 className="text-black yekan text-center">انبارداری</h2>
                  </Card>
                ) : null}
                {isPermit("reports", this.state.job) ? (
                  <Card
                    raised
                    className="p-5 pointer tale"
                    onClick={() => history.push("/reports/")}
                  >
                    <Icon
                      size="huge"
                      className="m-auto w-100"
                      name="chart pie"
                    />
                    <h2 className="text-black yekan text-center">گزارشات</h2>
                  </Card>
                ) : null}

                {isPermit("customers", this.state.job) ? (
                  <Card
                    raised
                    className="p-5 pointer tale"
                    onClick={() => history.push("/customers/")}
                  >
                    <Icon size="huge" className="m-auto w-100" name="users" />
                    <h2 className="text-black yekan text-center">مشتریان</h2>
                  </Card>
                ) : null}

                {isPermit("suppliers", this.state.job) ? (
                  <Card
                    raised
                    className="p-5 pointer tale"
                    onClick={() => history.push("/suppliers/")}
                  >
                    <Icon size="huge" className="m-auto w-100" name="truck" />
                    <h2 className="text-black yekan text-center">
                      تامین کنندگان
                    </h2>
                  </Card>
                ) : null}
              </Card.Group>
            </Header>
          </Segment>
        </div>
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

export default connect(null, null)(MainPage);
