import React from "react";
import { connect } from "react-redux";
import { Table, Pagination, Button, Icon } from 'semantic-ui-react'
import { getActiveBill } from '../../actions/SaleActions'
import { digitToComma } from '../utils/numberUtils'
import { standardTimeToJalaali } from '../utils/jalaaliUtils'
import ShowInformationModal from './showInformationModal'
import LoadingBar from '../utils/loadingBar'
const colSpan = 6;
class BillTable extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        activeBill: [],
        totalPageCount: 1,
        isOpenInformationModal: false,
        itemData:{}
    }
    componentDidMount() {
       this.getActiveBill()
    }
    getActiveBill = (page = 1) => {
        this.props.getActiveBill(page).then(() => {
            this.setState({
                activeBill: this.props.activeBill ? this.props.activeBill.results : {},
                totalPageCount: Math.ceil(this.props.activeBill.count / 25),
            });
        });
    }
    changePage = (event,{activePage}) => {
        this.getActiveBill(activePage);
    }
    closeInformationModal = () => {
        this.setState({isOpenInformationModal:false})
    }
    openInformationModal = (itemData) => {
        this.setState({ itemData }, () => {
            this.setState({isOpenInformationModal:true})
        })
    }
    render() {
        return this.state.activeBill.length > 0 ? (
            <>
        <ShowInformationModal data={this.state.itemData} open={this.state.isOpenInformationModal} onClose={this.closeInformationModal}/>
                
        <Table celled striped className="">
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan={colSpan} className="rtl text-right">لیست فاکتور های فعال</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                    <Table.HeaderCell className="text-center">عملیات</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">تعداد پرداختی ها</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">تاریخ ثبت</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">قیمت نهایی</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">تخفیف کل</Table.HeaderCell>
                    <Table.HeaderCell className="text-center">شماره تلفن خریدار</Table.HeaderCell>
            </Table.Row>
            </Table.Header>

                <Table.Body>
                     {/* <Input
                        iconPosition='left'
                        icon={<Icon name='search' inverted circular link />}
                        placeholder='Search...'
                    /> */}
                        {this.state.activeBill.map((item,index) => {
                            return (
                                <>
                                <Table.Row key={index}>
                                <Table.Cell className="norm-latin text-center">
                                    <Button onClick={()=>this.openInformationModal(item)} icon labelPosition='right' color="green">
                                       <span className="yekan" >افزودن آیتم جدید</span>
                                        <Icon name='add' />
                                    </Button>
                                    <Button onClick={()=>this.openInformationModal(item)} icon labelPosition='right' color="yellow">
                                       <span className="yekan" >نمایش اطلاعات</span>
                                        <Icon name='info' />
                                    </Button>
                                    </Table.Cell>
                                    <Table.Cell className="norm-latin text-center rtl"><span >{item.payments.length}</span>&nbsp;<span className="yekan">پرداختی</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center"><span>{standardTimeToJalaali(item.create_date)}</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center rtl"><span>{digitToComma(item.final_price)}</span>&nbsp;<span className="yekan">تومان</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center">{item.final_discount?(<><span className="yekan">digitToComma(item.final_discount)</span><span className="yekan">تومان</span></>):'--'}  </Table.Cell>
                                    <Table.Cell className="norm-latin text-center"><span>{item.buyer.phone_number}</span></Table.Cell>
                                    </Table.Row>
                                </>);
                            })}
                
                </Table.Body>
                <Table.Footer fullWidth hidden={this.state.totalPageCount < 2}>
                <Table.Row>
                    <Table.HeaderCell colSpan={colSpan} className="norm-latin">
                      <Pagination className="norm-latin" defaultActivePage={1} onPageChange={this.changePage} totalPages={this.state.totalPageCount} />
                    </Table.HeaderCell>
                </Table.Row>
                </Table.Footer>
                </Table>
            </>) : <LoadingBar/>;
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
