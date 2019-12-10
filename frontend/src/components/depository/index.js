import React from "react";
import { connect } from "react-redux";
import history from "../../history";
import { Button,Modal,Image,Header, Segment } from 'semantic-ui-react'
import AddProductModal from './addProductModal'
import ProductTable from './productTable'
import { getProductID } from '../../actions/DepositoryActions'

class Depository extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    state = {
        open: false,
        productID:NaN
    }
    closeModal = () => {
        this.setState({ open: false });
    }
    openModal = () => {
        this.props.getProductID().then(() => {
            this.setState({ productID: this.props.productID.pk }, () => {
                // console.log(this.props,this.state)
                this.setState({open:true})
            });
        });
    }
    render() {
        return (
            <>
                <AddProductModal open={this.state.open} code={this.state.productID} onClose={this.closeModal}/>
                <div id="depository">
                    <Segment stacked className="rtl">
                        <Button className="yekan" onClick={this.openModal} color="green" content='افزودن محصول جدید' icon='add' labelPosition='right' />
                    </Segment>
                    <ProductTable />
                </div>
            </>
        );
  }
}

const mapStateToProps = state => {
    // console.log('ppppppppp',state)
  return {
        productID: state.depository.productID,
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
  };
};

export default connect(
  mapStateToProps,
  { getProductID }
)(Depository);
