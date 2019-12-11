import React from "react";
import { connect } from "react-redux";
import { Table, Pagination } from 'semantic-ui-react'
import { getActiveBill } from '../../actions/SaleActions'
import { digitToComma } from '../utils/numberUtils'
import {standardTimeToJalaali} from '../utils/jalaaliUtils'
const colSpan = 9;
class BillTable extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        activeBill: [],
        totalPageCount:1
    }
    componentDidMount() {
       this.getActiveBill()
    }
    getActiveBill = (page = 1) => {
        this.props.getActiveBill(page).then(() => {
            console.log('xlksdjflksdkljflksdjflkjsdflksd', this.props);
            this.setState({
                activeBill: this.props.activeBill ? this.props.activeBill.results : {},
                totalPageCount: Math.ceil(this.props.activeBill.count / 25),
            });
        });
    }
    changePage = (event,{activePage}) => {
        this.getActiveBill(activePage);
    }
    render() {
        return this.state.activeBill.length > 0?(
        <Table celled striped className="">
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan={colSpan} className="rtl text-right">لیست محصولات</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                    <Table.HeaderCell className="text-center"></Table.HeaderCell>
                    <Table.HeaderCell className="text-center"></Table.HeaderCell>
                    <Table.HeaderCell className="text-center"></Table.HeaderCell>
                    <Table.HeaderCell className="text-center"></Table.HeaderCell>
                    <Table.HeaderCell className="text-center">تعداد پرداختی ها</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">تاریخ ثبت</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">قیمت نهایی</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">تخفیف کل</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">شماره تلفن خریدار</Table.HeaderCell>
            </Table.Row>
            </Table.Header>

                <Table.Body>
                    
                        {this.state.activeBill.map((item,index) => {
                            return(<Table.Row key={index}>
                                    <Table.Cell className="norm-latin text-center rtl"></Table.Cell>
                                    <Table.Cell className="norm-latin text-center rtl"></Table.Cell>
                                    <Table.Cell className="norm-latin text-center rtl"></Table.Cell>
                                    <Table.Cell className="norm-latin text-center"></Table.Cell>
                                    <Table.Cell className="norm-latin text-center rtl"><span >{item.payments.length}</span><span className="yekan">پرداختی</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center"><span>{standardTimeToJalaali(item.create_date)}</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center rtl"><span>{digitToComma(item.final_price)}</span>  <span className="yekan">تومان</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center">{item.final_discount?(<><span className="yekan">digitToComma(item.final_discount)</span><span className="yekan">تومان</span></>):'--'}  </Table.Cell>
                                    <Table.Cell className="norm-latin text-center"><span>{item.buyer.phone_number}</span></Table.Cell>
                                </Table.Row>);
                        })}
            
                </Table.Body>
                <Table.Footer fullWidth hidden={this.state.totalPageCount < 2}>
                <Table.Row>
                    <Table.HeaderCell colSpan={colSpan} className="norm-latin">
                      <Pagination className="norm-latin" defaultActivePage={1} onPageChange={this.changePage} totalPages={this.state.totalPageCount} />
                    </Table.HeaderCell>
                </Table.Row>
                </Table.Footer>
        </Table>):null;
    }
                                        
}

const mapStateToProps = state => {
  return {
            activeBill: state.sale.activeBill,
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
    { getActiveBill }
)(BillTable);
