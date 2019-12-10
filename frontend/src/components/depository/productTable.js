import React from "react";
import { connect } from "react-redux";
import { Table, Pagination } from 'semantic-ui-react'
import { getProductsList } from '../../actions/DepositoryActions'

class ProductTable extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        productsList:[]
    }
    componentDidMount() {
        this.props.getProductsList().then(() => {
            console.log('xlksdjflksdkljflksdjflkjsdflksd', this.props);
            this.setState({productsList:this.props.productsList.results})
        })
    }
    render() {
        return (
        <Table celled striped className="">
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan='10' className="rtl text-right">لیست محصولات</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                    <Table.HeaderCell className="text-center">رنگ پس زمینه</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">رنگ طرح</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">جنس</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">نوع پارچه</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">نوع طرح</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">مقدار باقی مانده</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">قیمت فروش</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">قیمت خرید</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">نام محصول</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">کد محصول</Table.HeaderCell>
      </Table.Row>
            </Table.Header>

                <Table.Body>
                    
                        {this.state.productsList.map(item => {
                            return(<Table.Row>
                                    <Table.Cell className="norm-latin text-center"><span className="yekan">{item.background_color.name}</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center"><span className="yekan">{item.design_color.name}</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center"><span className="yekan">{item.material.name}</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center"><span className="yekan">{item.f_type.name}</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center"><span className="yekan">{item.design.name}</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center rtl">
                                    <span>{item.stock_amount}</span>
                                    <span className="yekan">متر</span>
                                    </Table.Cell>
                                    <Table.Cell className="norm-latin text-center rtl"><span>{item.selling_price}</span> <span className="yekan">تومان</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center rtl"><span>{item.buying_price}</span> <span className="yekan">تومان</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center"><span>{item.code}</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center" textAlign='right'>
                                    <span>{item.code}</span>
                                    </Table.Cell>
                                </Table.Row>);
                        })}
            
                </Table.Body>
                <Table.Footer fullWidth>
                <Table.Row>
                    <Table.HeaderCell colSpan='10' className="norm-latin">
                      <Pagination className="norm-latin" defaultActivePage={5} totalPages={10} />
                    </Table.HeaderCell>
                </Table.Row>
                </Table.Footer>
        </Table>);
    }
                                        
}

const mapStateToProps = state => {
  return {
            productsList: state.depository.productsList,
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
    { getProductsList }
)(ProductTable);
