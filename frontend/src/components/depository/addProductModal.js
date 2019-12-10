
import React from "react";
import { connect } from "react-redux";
import {setNewBill,getActiveBill} from '../../actions/SaleActions'
import { Button, Modal, Divider, Header, Segment, Form, Card, Popup, Icon, Message } from 'semantic-ui-react'
import {toastr} from 'react-redux-toastr'
class AddBillModal extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // toastr.success('asdf','sadfsdfdfssdf')
        this.props.getActiveBill();
    }
    state = {
        isOpenAddItem: false,
        formValidation: {
            phone_number: false,
            used_points: false,
            branch: false,
            discount: false,
            items:false
        },
        phone_number: '',
        used_points: '',
        branch: 1,
        discount: 0,
        itemsDOM: [],
        itemsDataSheet: [],
        branchOptions: [
            { key: '1', value: '1', flag: 'ir', text: 'شعبه یک' },
        ]
    };
    
    toggleAddItemPopup = () => {
        this.setState((prevState)=>({isOpenAddItem: !prevState.isOpenAddItem}))
    }
    inputChange = (event, inputName) => {
        console.log(event,inputName)
        this.setState({
            [inputName]: event.target.value
        })
    }
    formSubmitHandler = () => {
        this.setState({ formValidation: { ...this.state.formValidation, used_points: false, discount: false, phone_number: false,items:false } }, () => {
            let hasError = false;
            if (this.state.phone_number.length !== 11) {
                this.setState({ formValidation: { ...this.state.formValidation, phone_number: true } });
                hasError = true;
            }
            if (this.state.used_points.length < 1) {
                this.setState({ formValidation: { ...this.state.formValidation, used_points: true } });
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
                    used_points: this.state.used_points,
                    branch: this.state.branch,
                    items: this.state.itemsDataSheet
                }
                console.log(prepareData, hasError);
                this.props.setNewBill(prepareData);
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
                    <Modal.Header className="yekan">ثبت محصول جدید</Modal.Header>
                    <Modal.Content scrolling>
                        <Modal.Description>
                            <Form>
                                <Form.Group unstackable widths={2}>
                                    <Form.Input className='ltr placeholder-rtl' label='کد محصول' type="number" error={this.state.formValidation.code} onChange={(e)=>this.inputChange(e,'code')} placeholder='کد محصول' />
                                    <Form.Input className='ltr placeholder-rtl' label='نام محصول' type="number" error={this.state.formValidation.name} onChange={(e)=>this.inputChange(e,'name')} placeholder='نام محصول' />
                                </Form.Group>
                                <Form.Group unstackable widths={2}>
                                    <Form.Input className='ltr placeholder-rtl' label='قیمت خرید' type="number" error={this.state.formValidation.buying_price} onChange={(e)=>this.inputChange(e,'buying_price')} placeholder='قیمت خرید' />
                                    <Form.Input className='ltr placeholder-rtl' label='قیمت فروش' type="number" error={this.state.formValidation.selling_price} onChange={(e)=>this.inputChange(e,'selling_price')} placeholder='قیمت فروش' />
                                </Form.Group>
                                  <Form.Group unstackable widths={2}>
                                    <Form.Input className='ltr placeholder-rtl' label='مقدار باقی مانده' type="number" error={this.state.formValidation.stock_amount} onChange={(e)=>this.inputChange(e,'stock_amount')} placeholder='مقدار باقی مانده' />
                                    <Form.Dropdown className='ltr placeholder-rtl text-right' defaultValue={'1'} placeholder='شعبه' selection label='شعبه' options={this.state.branchOptions} />
                                </Form.Group>
                                <Form.Group widths={2}>
                                    
                                    {/* <Form.Input   placeholder='شعبه' /> */}
                                    <Form.Input className='ltr placeholder-rtl' label='تخفیف کلی' type="number" defaultValue='0' error={this.state.formValidation.discount} onChange={(e)=>this.inputChange(e,'discount')} placeholder='مقدار تخفیف' />
                                </Form.Group>
                                
                            </Form>
                        </Modal.Description>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button color='black' onClick={this.props.onClose}><span>بستن</span></Button>
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
  { setNewBill,getActiveBill }
)(AddBillModal);
