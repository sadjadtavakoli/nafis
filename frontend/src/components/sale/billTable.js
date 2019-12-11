import React from "react";
import { connect } from "react-redux";
import { Table, Pagination, Button, Icon, Popup } from 'semantic-ui-react';
import { getActiveBill } from '../../actions/SaleActions'
import { digitToComma, phoneNumberBeautifier } from '../utils/numberUtils';
import { standardTimeToJalaali } from '../utils/jalaaliUtils'
import ShowInformationModal from './showInformationModal'
import LoadingBar from '../utils/loadingBar'
import NewBillPopup from './newBillPopup'

const colSpan = 6;
class BillTable extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        activeBill: [],
        totalPageCount: 1,
        isOpenInformationModal: false,
        itemData: {},
        isOpenAddItem: NaN,
        activePage:1
    }
    componentDidMount() {
       this.getActiveBill()
    }
    getActiveBill = (page = 1) => {
        this.props.getActiveBill(page).then(() => {
            this.setState({
                activeBill: this.props.activeBill ? this.props.activeBill.results : {},
                totalPageCount: this.props.activeBill? Math.ceil(this.props.activeBill.count / 25):0,
            });
        });
    }
    changePage = (event, { activePage }) => {
        this.setState({ activePage }, () => {
            this.getActiveBill(this.state.activePage);
        })
    }
    closeInformationModal = () => {
        this.setState({isOpenInformationModal:false})
    }
    openInformationModal = (itemData) => {
        this.setState({ itemData }, () => {
            this.setState({isOpenInformationModal:true})
        })
    }
    toggleAddItemPopup = (id) => {
        this.setState({ isOpenAddItem: id });
    };
        submitItemPopup = (data) => {
        let id = this.state.itemsDataSheet.length;
        // const itemDOM = (<Card fluid key={id}>
        //     <Card.Content>
        //         <Card.Header className='yekan'>آیتم شماره {id+1} </Card.Header>
        //         <Card.Description className='yekan'>
        //                 <Message compact size='mini' color='teal'>داده های زیر صرفا جهت خواندن هستن و برای جلوگیری از اشتباهات انسانی قابل تغییر نمی باشند. </Message>

        //             </Card.Description>
        //     </Card.Content>
        //     <Card.Content extra>
        //         <Form>
        //             <Form.Group widths='equal'>
        //                 <Form.Input className='ltr placeholder-rtl' readOnly fluid defaultValue={data.product} label='کد محصول' placeholder='' />
        //                 <Form.Input className='ltr placeholder-rtl' readOnly fluid defaultValue={data.amount} label='مقدار(متر)' placeholder='' />
        //                 <Form.Input className='ltr placeholder-rtl' readOnly fluid defaultValue={data.discount} label='تخفیف' placeholder='' />
        //             </Form.Group>
        //             <Form.Group widths='3'>
        //                 <Form.Checkbox toggle className='ltr placeholder-rtl' readOnly checked={data.end_of_roll} label='ته طاقه؟' />
        //                 <Form.Input className={`ltr placeholder-rtl ${data.end_of_roll ? '' : 'invisible'}`} readOnly defaultValue={data.end_of_roll_amount} label='مقدار ته طاقه' placeholder='مقدار ته طاقه' />
        //             </Form.Group>
        //         </Form>
        //     </Card.Content>
        // </Card>);
        this.setState(
            {
                // itemsDOM: [...this.state.itemsDOM, itemDOM],
                itemsDataSheet: [...this.state.itemsDataSheet, data],
                formValidation:{...this.state.formValidation,items:false}
            }
            , () => {
        });
        this.toggleAddItemPopup();
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
                                            <Popup
                                                content={<NewBillPopup refetch={()=>this.getActiveBill(this.state.activePage)} phoneNumber={item.buyer.phone_number} pk={item.pk} onClose={()=>this.toggleAddItemPopup(NaN)} onSubmit={this.submitItemPopup}/>}
                                            open={this.state.isOpenAddItem === index}
                                            className="no-filter"
                                            position='bottom center'
                                            wide='very'
                                                trigger={
                                                     <Button onClick={()=>this.toggleAddItemPopup(index)} icon labelPosition='right' color="green">
                                                        <span className="yekan" >افزودن آیتم جدید</span>
                                                        <Icon name='add' />
                                                    </Button>
                                                }
                                                color='green' size='huge' icon='add' />
                           
                                    <Button onClick={()=>this.openInformationModal(item)} icon labelPosition='right' color="yellow">
                                       <span className="yekan" >نمایش اطلاعات</span>
                                        <Icon name='info' />
                                    </Button>
                                    </Table.Cell>
                                    <Table.Cell className="norm-latin text-center rtl"><span >{item.payments.length}</span>&nbsp;<span className="yekan">پرداختی</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center"><span>{standardTimeToJalaali(item.create_date)}</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center rtl"><span>{digitToComma(item.final_price)}</span>&nbsp;<span className="yekan">تومان</span></Table.Cell>
                                    <Table.Cell className="norm-latin text-center">{item.final_discount?(<><span className="yekan">digitToComma(item.final_discount)</span><span className="yekan">تومان</span></>):'--'}  </Table.Cell>
                                    <Table.Cell className="norm-latin text-center"><span>{phoneNumberBeautifier(item.buyer.phone_number)}</span></Table.Cell>
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
