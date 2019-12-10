import React from "react";
import { connect } from "react-redux";
import history from "../../history";
import { Button,Modal,Image,Header, Segment } from 'semantic-ui-react'
import AddProductModal from './addProductModal'
import ProductTable from './productTable'

class Depository extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    state = {
        open: false
    }
    closeModal = () => {
        this.setState({ open: false });
    }
    render() {
        return (
            <>
                <AddProductModal open={this.state.open} onClose={this.closeModal}/>
                <div id="depository">
                    <Segment stacked className="rtl">
                        <Button className="yekan" onClick={() => this.setState({ open: true })} color="green" content='افزودن محصول جدید' icon='add' labelPosition='right' />
                    </Segment>
                    <ProductTable />
                </div>
            </>
        );
  }
}

const mapStateToProps = state => {
    console.log(state)
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
};

export default connect(
  mapStateToProps,
  {  }
)(Depository);
