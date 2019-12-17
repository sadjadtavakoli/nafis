import React from "react";
import { connect } from "react-redux";
import NewBillPopup from './newBillPopup'
import { setNewBill,getCustomerByPhoneNumber } from '../../actions/SaleActions'
import { enToFa } from '../utils/numberUtils'
import { Button, Modal, Divider, Header, Segment, Form, Card, Popup, Icon, Message, Label } from 'semantic-ui-react'
import {toastr} from 'react-redux-toastr'
const INITIAL_STATE = {
    isOpenAddItem: false,
    formValidation: {
        phone_number: false,
        branch: false,
        discount: false,
        items: false
    },
    phone_number: '',
    branch: 1,
    discount: 0,
    itemsDOM: [],
    itemsDataSheet: [],
    branchOptions: [
        { key: '1', value: '1', flag: 'ir', text: 'شعبه یک' },
    ],
    customerData:{}
};
class AddBillModal extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // toastr.success('asdf','sadfsdfdfssdf')
    }
    state = INITIAL_STATE;
    toggleAddItemPopup = () => {
        this.setState((prevState)=>({isOpenAddItem: !prevState.isOpenAddItem}))
    }
    deleteItem = (id) => {
        var r = window.confirm("آیا از حذف این مورد مطمئن هستید؟");
        if (r == true) {
            let itemsDataSheet = this.state.itemsDataSheet;
            let itemsDOM = this.state.itemsDOM;
            for( var i = 0; i < itemsDataSheet.length; i++){ 
                if ( i === id) {
                    itemsDataSheet.splice(i, 1); 
                    itemsDOM.splice(i, 1); 
                }
            };
            this.setState({ itemsDataSheet, itemsDOM });
        }
       
    }
    submitItemPopup = (data) => {
        // console.log('data hast',data)
        let id = this.state.itemsDataSheet.length;
        const itemDOM = (<Card fluid key={id}>
            <Card.Content>
                <Card.Header className='yekan'>
                    {data.name}
                    <span>
                        <Label color='red' onClick={()=>this.deleteItem(id)} className="pointer" style={{marginRight: 10}}>
                            <Icon name='trash' /> حذف آیتم
                        </Label>
                    </span>
                </Card.Header>
                <Card.Description className='yekan'>
                        <Message compact size='mini' color='teal'>داده های زیر صرفا جهت خواندن هستن و برای جلوگیری از اشتباهات انسانی قابل تغییر نمی باشند. </Message>
                    </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Input className='ltr placeholder-rtl' readOnly fluid defaultValue={data.name} label='نام محصول' placeholder='' />
                        <Form.Input className='ltr placeholder-rtl' readOnly fluid defaultValue={data.product} label='کد محصول' placeholder='' />
                        <Form.Input className='ltr placeholder-rtl' readOnly fluid defaultValue={data.amount} label='مقدار(متر)' placeholder='' />
                        <Form.Input className='ltr placeholder-rtl' readOnly fluid defaultValue={data.discount} label='تخفیف' placeholder='' />
                    </Form.Group>
                    <Form.Group widths='3'>
                        <Form.Checkbox toggle className='ltr placeholder-rtl' readOnly checked={data.end_of_roll} label='ته طاقه؟' />
                        <Form.Input className={`ltr placeholder-rtl ${data.end_of_roll ? '' : 'invisible'}`} readOnly defaultValue={data.end_of_roll_amount} label='مقدار حساب شده' placeholder='مقدار حساب شده' />
                    </Form.Group>
                </Form>
            </Card.Content>
        </Card>);
        this.setState(
            {
                itemsDOM: [...this.state.itemsDOM, itemDOM],
                itemsDataSheet: [...this.state.itemsDataSheet, data],
                formValidation:{...this.state.formValidation,items:false}
            }
            , () => {
        });
        this.toggleAddItemPopup();
    }
    getCustomerData(phone_number) {
        if (phone_number.length === 11) {
            this.props.getCustomerByPhoneNumber(phone_number).then(({ data }) => {
                this.setState({customerData:data})
            })
        }
    };
    inputChange = (event, inputName) => {
        this.setState({
            [inputName]: event.target.value
        }, () => {
            // console.log(this.state.phone_number.length)
            if (inputName === 'phone_number') {
                if (this.state.phone_number.length === 11) {
                    this.getCustomerData(this.state.phone_number)
                } else {
                    this.setState({ customerData: {} })
                }
            };
        });
    }
    formSubmitHandler = () => {
        this.setState({ formValidation: { ...this.state.formValidation, discount: false, phone_number: false,items:false } }, () => {
            let hasError = false;
            if (this.state.phone_number.length !== 11) {
                this.setState({ formValidation: { ...this.state.formValidation, phone_number: true } });
                hasError = true;
            }
          
            if (this.state.discount.length < 1) {
                this.setState({ formValidation: { ...this.state.formValidation, discount: true } });
                hasError = true;
            }
            if (this.state.itemsDataSheet.length < 1) {
                this.setState({ formValidation: { ...this.state.formValidation, items: true } });
                hasError = true;
            }
            if (!hasError) {
                const prepareData = {
                    phone_number: this.state.phone_number,
                    discount: this.state.discount,
                    branch: this.state.branch,
                    items: this.state.itemsDataSheet
                }
                this.props.setNewBill(prepareData).then(() => {
                    this.setState(INITIAL_STATE);
                    this.props.onClose();
                    toastr.success('ثبت فاکتور جدید', 'فاکتور جدید با موفقیت ثبت شد');

                });
            }
        });
        
       
    }
    render() {
        return (
            <div >
                <Modal id="add-bill"
                    closeOnDimmerClick={false}
                    dimmer='blurring'
                    className="text-right rtl yekan"
                    open={this.props.open}
                    onClose={this.props.onClose}>
                    <Modal.Header className="yekan">ثبت فاکتور جدید</Modal.Header>
                    <Modal.Content scrolling>
                        <Modal.Description>
                            {Object.keys(this.state.customerData).length > 0? <Label color='blue'><span>امتیاز مشتری:&nbsp;</span><span>{enToFa(String(this.state.customerData.points))}</span><span>&nbsp;امتیاز</span></Label> : <Label className='invisible'><span>ا</span></Label>}
                            <Form>
                                <Form.Group unstackable widths={2}>
                                    <Form.Input className='ltr placeholder-rtl' label='شماره تلفن همراه' type="number" error={this.state.formValidation.phone_number} onChange={(e)=>this.inputChange(e,'phone_number')} placeholder='شماره تلفن همراه' />
                                    <Form.Dropdown className='ltr placeholder-rtl text-right' defaultValue={'1'} placeholder='شعبه' selection label='شعبه' options={this.state.branchOptions} />
                                </Form.Group>
                                <Segment >
                                    <Header as='h3' floated='right'>
                                    <span>اقلام</span>
                                    </Header>
                                    
                                    <Divider clearing />
                                     <Message negative className={this.state.formValidation.items?'':'d-none'}>
                                        <Message.Header className="yekan">خطا در تکمیل فاکتور</Message.Header>
                                        <p>
                                        جهت تکمیل فرم، فاکتور شما حتما باید حاوی حداقل یک قلم باشد
                                        </p>
                                    </Message>
                                    {this.state.itemsDOM.map((item,index) => {
                                        return(<Card.Group key={index}>{item}</Card.Group>)
                                    })}
                                    <div className="text-center padded">
                                        <Popup
                                            style={{top:-70}}
                                            content={<NewBillPopup onClose={this.toggleAddItemPopup} onSubmit={this.submitItemPopup}/>}
                                            open={this.state.isOpenAddItem}
                                            className="no-filter"
                                            position='bottom center'
                                            wide='very'
                                            trigger={<Button circular onClick={() => {this.toggleAddItemPopup(this.state.isOpenAddItem) }} color='green' size='huge' icon='add' />}
                                        />
                                        
                                    </div>
                                </Segment>
                                  <Form.Group widths={1}>
                                    <Form.Input className='ltr placeholder-rtl' label='تخفیف کلی' type="number" defaultValue='0' error={this.state.formValidation.discount} onChange={(e)=>this.inputChange(e,'discount')} placeholder='مقدار تخفیف' />
                                </Form.Group>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button color='black' onClick={() => { this.props.onClose();this.setState({isOpenAddItem:false}) }}><span>بستن</span></Button>
                        <Button className="yekan"
                            positive
                            icon='checkmark'
                            labelPosition='right'
                            content="ثبت فاکتور"
                            onClick={this.formSubmitHandler}
                        />
                    </Modal.Actions>
                </Modal>
                    
            </div>
        );
  }
}

const mapStateToProps = state => {
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
  { setNewBill,getCustomerByPhoneNumber }
)(AddBillModal);
