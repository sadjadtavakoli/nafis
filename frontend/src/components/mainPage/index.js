import React from "react";
import { connect } from "react-redux";
import { Card, Header, Icon, Segment } from "semantic-ui-react";
import history from "../../history";
import {isPermit} from './permission'
class MainPage extends React.Component {
  state = { showModal: false, modalInput: "" };
  componentWillReceiveProps() {
    this.forceUpdate();
  }
  render() {
    return (
      <div className="main-page__container">
        <div className="main-page__items-container">
          <Segment placeholder>
            <Header >
              <Card.Group itemsPerRow={6} className="rtl" padded>
                {isPermit('sale') ?
                  <Card raised ><Segment className="text-center" compact padded><Icon padded size="massive" name="money bill alternate" /><span>فروش</span></Segment></Card> : null}
                
                {isPermit('cashregister') ?
                  <Card raised ><Segment className="text-center" compact padded><Icon padded size="massive" name="fax" /><span>صندوق</span></Segment></Card> : null}
                
                {isPermit('depository') ?
                  <Card raised ><Segment className="text-center" compact padded><Icon padded size="massive" name="factory" /><span>انبارداری</span></Segment></Card> : null}
                
              </Card.Group>
              
              
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
