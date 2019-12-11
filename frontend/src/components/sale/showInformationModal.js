import React from "react";
import { connect } from "react-redux";
import { enToFa } from '../utils/numberUtils'
import {setNewBill} from '../../actions/SaleActions'
import { Button, Modal, Divider, Header, Segment, Form, Card, Dimmer, Loader, Image, Icon, Message, Label } from 'semantic-ui-react'
import {toastr} from 'react-redux-toastr'

class ShowInformationModal extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps() {
        this.setState({data:this.props.data})
    }
    componentDidMount() {
    //    this.setState({data:this.props.data})
        // toastr.success('asdf','sadfsdfdfssdf')
    }
    state = {
        data: {},
        isOpenAddItem: false,
        formValidation: {
        },
        phone_number: '',
        used_points: '',
        branch: 1,
        discount: 0,
        itemsDOM: [],
        branchOptions: [
            { key: '1', value: '1', flag: 'ir', text: 'شعبه یک' },
        ]
    };
    toggleAddItemPopup = () => {
        this.setState((prevState)=>({isOpenAddItem: !prevState.isOpenAddItem}))
    }
    itemsRender = (item,index) => {
        // console.log('itemsRender',item)
        let id = Object.keys(this.state.data.items).length;
        return (<Card.Group key={index}>
            <Card fluid>
                <Card.Content>
                    <Card.Header className='yekan'>آیتم شماره {enToFa(id)}<span>
                    <Label color='red' className="pointer">
                        <Icon name='trash' /> حذف آیتم
                    </Label>
                    </span> </Card.Header>
                    <Card.Description className='yekan'>
                        <Message compact size='mini' color='teal'>داده های زیر صرفا جهت خواندن هستن و برای جلوگیری از اشتباهات انسانی قابل تغییر نمی باشند. </Message>

                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Input className='ltr placeholder-rtl' readOnly fluid defaultValue={item.product.code} label='کد محصول' placeholder='' />
                            <Form.Input className='ltr placeholder-rtl' readOnly fluid defaultValue={item.amount} label='مقدار(متر)' placeholder='' />
                            <Form.Input className='ltr placeholder-rtl' readOnly fluid defaultValue={item.discount} label='تخفیف' placeholder='' />
                        </Form.Group>
                        <Form.Group widths='3'>
                            <Form.Checkbox toggle className='ltr placeholder-rtl' readOnly checked={item.end_of_roll} label='ته طاقه؟' />
                            <Form.Input className={`ltr placeholder-rtl ${item.end_of_roll ? '' : 'invisible'}`} readOnly defaultValue={item.end_of_roll_amount} label='مقدار ته طاقه' placeholder='مقدار ته طاقه' />
                        </Form.Group>
                    </Form>
                </Card.Content>
            </Card>
        </Card.Group>);
    }
    inputChange = (event, inputName) => {
        console.log(event,inputName)
        this.setState({
            [inputName]: event.target.value
        })
    }
    // formSubmitHandler = () => {
    //     this.setState({ formValidation: { ...this.state.formValidation, used_points: false, discount: false, phone_number: false,items:false } }, () => {
    //         let hasError = false;
    //         if (this.state.phone_number.length !== 11) {
    //             this.setState({ formValidation: { ...this.state.formValidation, phone_number: true } });
    //             hasError = true;
    //         }
    //         if (this.state.used_points.length < 1) {
    //             this.setState({ formValidation: { ...this.state.formValidation, used_points: true } });
    //             hasError = true;
    //         }
    //         if (this.state.discount.length < 1) {
    //             this.setState({ formValidation: { ...this.state.formValidation, discount: true } });
    //             hasError = true;
    //         }
    //         if (this.state.itemsDataSheet.length < 1) {
    //             this.setState({ formValidation: { ...this.state.formValidation, items: true } });
    //             hasError = true;
    //         }
    //         if (!hasError) {
    //             const prepareData = {
    //                 phone_number: this.state.phone_number,
    //                 discount: this.state.discount,
    //                 used_points: this.state.used_points,
    //                 branch: this.state.branch,
    //                 items: this.state.itemsDataSheet
    //             }
    //             console.log(prepareData, hasError);
    //             this.props.setNewBill(prepareData);
    //         }
    //     });
        
       
    // }
    labelRender = (labelName) => {
        return (
            <span style={{marginBottom: '2.5px',alignItems: 'center', display: 'flex',justifyContent: 'flex-end'}}>
                <Label className="pointer" style={{marginRight: 10}} size='mini' color="teal" >
                <Icon name='edit' /> ویرایش
            </Label>
                <span>{labelName}</span>
            </span>
        )
    }
    render() {

        return Object.keys(this.state.data).length > 0?(
            <div >
                <Modal id="add-bill"
                    closeOnDimmerClick={false}
                    dimmer='blurring'
                    className="text-right rtl yekan"
                    open={this.props.open}
                    onClose={this.props.onClose}>
                    <Modal.Header className="yekan">فاکتور</Modal.Header>
                    <Modal.Content scrolling>
                        <Modal.Description>
                            <Form>
                                <Form.Group unstackable widths={2}>
                                    <Form.Input className='ltr placeholder-rtl' readOnly defaultValue={this.state.data.buyer.phone_number} label={()=>this.labelRender('شماره تلفن همراه')} type="number" error={this.state.formValidation.phone_number} onChange={(e)=>this.inputChange(e,'phone_number')} placeholder='شماره تلفن همراه' />
                                    <Form.Input className='ltr placeholder-rtl' readOnly defaultValue={this.state.data.used_points} label={()=>this.labelRender('امتیاز استفاده شده')} type="number" error={this.state.formValidation.used_points} onChange={(e)=>this.inputChange(e,'used_points')} placeholder='امتیاز استفاده شده' />
                                </Form.Group>
                                <Form.Group widths={2}>
                                    <Form.Dropdown className='ltr placeholder-rtl text-right' readOnly defaultValue={'1'} placeholder='شعبه' selection label={'شعبه'} options={this.state.branchOptions} />
                                    <Form.Input className='ltr placeholder-rtl' readOnly defaultValue={this.state.data.discount} label={()=>this.labelRender('تخفیف کلی')}  type="number" defaultValue='0' error={this.state.formValidation.discount} onChange={(e)=>this.inputChange(e,'discount')} placeholder='مقدار تخفیف' />
                                </Form.Group>
                                <Message
                                    hidden={Object.keys(this.state.data.items).length > 0}
                                    icon='inbox'
                                    color='red'
                                    header='قلمی در این فاکتور موجود نمی باشد'
                                    content={<span>جهت افزودن می توانید در صفحه قبل بروی <b>افزودن آیتم جدید</b> کلیک نمایید</span>}
                                />
                                <Segment hidden={Object.keys(this.state.data.items).length === 0}>
                                    <Header as='h3' floated='right'>
                                    <span>اقلام</span>
                                    </Header>
                                    
                                    <Divider clearing />
                                    {this.state.data.items.map((item, index) => {
                                        return this.itemsRender(item,index)
                                    })}
                                </Segment>
                                

                                
                            </Form>
                        </Modal.Description>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button color='black' onClick={this.props.onClose}><span>بستن</span></Button>
                    </Modal.Actions>
                </Modal>
                    
            </div>
        ):null;
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
  mapStateToProps,
  { setNewBill }
)(ShowInformationModal);
