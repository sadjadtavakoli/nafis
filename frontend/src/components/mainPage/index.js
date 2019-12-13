import React from "react";
import { connect } from "react-redux";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import history from "../../history";

class MainPage extends React.Component {
  state = { showModal: false, modalInput: "" };

  render() {
    return (
      <div className="main-page__container">
        <div className="main-page__items-container">
          <Segment placeholder>
            <Header icon>
              <Icon name="wordpress forms" />
              <span>صفحه‌ی پیشخوان در حال طراحی و اجرا می باشد</span>
            </Header>
          </Segment>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    nextReceipt: state.receipts.nextReceipt,
    currentUser: state.auth.currentUser
      ? state.auth.currentUser
      : localStorage.getItem("user")
      ? localStorage.getItem("user")
      : "",
    type: state.auth.type
      ? state.auth.type
      : localStorage.getItem("type")
      ? localStorage.getItem("type")
      : ""
  };
};

export default connect(null, null)(MainPage);
