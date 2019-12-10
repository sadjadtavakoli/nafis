import React from "react";
import { connect } from "react-redux";
import { Table,Pagination } from 'semantic-ui-react'
import { getProductFields } from '../../actions/DepositoryActions'
class ProductTable extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
    }
    componentDidMount() {
        this.props.getProductFields();
        console.log(this.props)
    }
    render() {
        return (
        <Table celled striped className="">
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan='4' className="rtl text-right">لیست محصولات</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                    <Table.HeaderCell className="text-center">عملیات</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">مقدار باقی مانده</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">نام محصول</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">کد محصول</Table.HeaderCell>
      </Table.Row>
            </Table.Header>

                <Table.Body>
                    
            <Table.Row>
                <Table.Cell>
                node_modules
                </Table.Cell>
                <Table.Cell >
                node_modules
                </Table.Cell>
                <Table.Cell collapsing>Initial commit</Table.Cell>
                <Table.Cell collapsing textAlign='right'>
                10 hours ago
                </Table.Cell>
            </Table.Row>
            
                </Table.Body>

                <Table.Footer fullWidth>
                <Table.Row>
                    <Table.HeaderCell colSpan='4' className="norm-latin">
                      <Pagination className="norm-latin" defaultActivePage={5} totalPages={10} />
                    </Table.HeaderCell>
                </Table.Row>
                </Table.Footer>
        </Table>);
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
    null,
    {getProductFields}
)(ProductTable);
