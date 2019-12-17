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
            <Header padded>
              <Card.Group itemsPerRow={6} className="rtl padded" >
                {isPermit('sale') ?
                  <Card raised className="p-5 pointer tale" onClick={()=>history.push('/sale/')}><Icon padded size="huge" className="m-auto w-100" name="money bill alternate" /><h2 className="text-black yekan text-center">فروش</h2></Card> : null}
                
                {isPermit('cashregister') ?
                  <Card raised className="p-5 pointer tale" onClick={()=>history.push('/cashregister/')}><Icon padded size="huge" className="m-auto w-100" name="fax" /><h2 className="text-black yekan text-center">صندوق</h2></Card> : null}
                
                {isPermit('depository') ?
                  <Card raised className="p-5 pointer tale" onClick={()=>history.push('/depository/')}><Icon padded size="huge" className="m-auto w-100" name="factory" /><h2 className="text-black yekan text-center">انبارداری</h2></Card> : null}
                
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
