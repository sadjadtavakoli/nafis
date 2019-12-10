
import React from "react";
import { connect } from "react-redux";
import {setNewBill,getActiveBill} from '../../actions/SaleActions'
import { Button, Modal, Divider, Dropdown, Segment, Form, Card, Popup, Icon, Message } from 'semantic-ui-react'
import {toastr} from 'react-redux-toastr'
import { getProductFields,setNewProduct } from '../../actions/DepositoryActions'
const FORM_VALIDATION = {
    code: false,
    name: false,
    buying_price: false,
    selling_price: false,
    stock_amount: false,
    //--------- Options ---------
    f_type: false,
    design: false,
    material: false,
    background_color: false,
    design_color: false,
};
class AddBillModal extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // toastr.success('asdf','sadfsdfdfssdf')
        this.props.getProductFields().then(() => {
            console.log('propseeeee',this.props);
            this.setState({
                background_color_Options: this.props.productFields.background_color,
                design_color_Options: this.props.productFields.design_color,
                material_Options: this.props.productFields.material,
                design_Options: this.props.productFields.design,
                f_type_Options: this.props.productFields.f_type
            })
        });
    }
    state = {
        f_type: '',
        design: '',
        material:'',
        background_color:'',
        design_color: '',
        //------------------------------
        f_type_Options: {},
        design_Options: {},
        material_Options:{},
        background_color_Options:{},
        design_color_Options:{},
        formValidation: FORM_VALIDATION,
        code:'',
        name:'',
        buying_price:'',
        selling_price:'',
        stock_amount: '',
        branch:1,
        branchOptions: [
            { key: '1', value: '1', flag: 'ir', text: 'شعبه یک' },
        ]
    };
    
    inputChange = (event, inputName) => {
        this.setState({
            [inputName]: event.target.value
        });
    }
    selectChange = (e, { name, value }) => {
        this.setState({
            [name]: value
        },()=>{
            console.log(this.state);
        });
        
    }
    formSubmitHandler = () => {
        this.setState({ formValidation: { ...this.state.formValidation, ...FORM_VALIDATION } }, () => {
            let hasError = false;
            if (String(this.state.code).length < 1) {
                this.setState({ formValidation: { ...this.state.formValidation, code: true } });
                hasError = true;
            }
            if (String(this.state.name).length < 1) {
                this.setState({ formValidation: { ...this.state.formValidation, name: true } });
                hasError = true;
            }
            if (String(this.state.buying_price).length < 1) {
                this.setState({ formValidation: { ...this.state.formValidation, buying_price: true } });
                hasError = true;
            }
            if (String(this.state.selling_price).length < 1) {
                this.setState({ formValidation: { ...this.state.formValidation, selling_price: true } });
                hasError = true;
            }
            if (String(this.state.stock_amount).length < 1) {
                this.setState({ formValidation: { ...this.state.formValidation, stock_amount: true } });
                hasError = true;
            }
            // ---------- Options ----------
            if (String(this.state.background_color).length < 1) {
                this.setState({ formValidation: { ...this.state.formValidation, background_color: true } });
                hasError = true;
            }
            if (String(this.state.design_color).length < 1) {
                this.setState({ formValidation: { ...this.state.formValidation, design_color: true } });
                hasError = true;
            }
            if (String(this.state.material).length < 1) {
                this.setState({ formValidation: { ...this.state.formValidation, material: true } });
                hasError = true;
            }
            if (String(this.state.f_type).length < 1) {
                this.setState({ formValidation: { ...this.state.formValidation, f_type: true } });
                hasError = true;
            }
            if (String(this.state.design).length < 1) {
                this.setState({ formValidation: { ...this.state.formValidation, design: true } });
                hasError = true;
            }
            if (!hasError) {
                const prepareData = {
                    code:this.state.code,
                    name:this.state.name,
                    buying_price:this.state.buying_price,
                    selling_price:this.state.selling_price,
                    stock_amount: this.state.stock_amount,
                    branch: this.state.branch,
                    background_color: this.state.background_color,
                    f_type: this.state.f_type,
                    design_color: this.state.design_color,
                    design: this.state.design,
                    material: this.state.material,
                    
                }
                console.log('prepareData',prepareData, hasError);
                this.props.setNewProduct(prepareData);
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
                                <Divider />
                                
                                <Form.Group widths={3}>
                                    <Form.Select fluid placeholder='رنگ پس زمینه' label='رنگ پس زمینه' search selection error={this.state.formValidation.background_color} onChange={this.selectChange} name="background_color" options={this.state.background_color_Options} />
                                    <Form.Select fluid placeholder='رنگ طرح' label='رنگ طرح' search selection error={this.state.formValidation.design_color} onChange={this.selectChange} name="design_color" options={this.state.design_color_Options} />
                                    <Form.Select fluid placeholder='جنس' label='جنس' search selection error={this.state.formValidation.material} onChange={this.selectChange} name="material" options={this.state.material_Options} />
                                </Form.Group>
                                <Form.Group widths={3}>
                                    <Form.Select fluid placeholder='نوع پارچه' label='نوع پارچه' search selection error={this.state.formValidation.f_type} onChange={this.selectChange} name="f_type" options={this.state.f_type_Options} />
                                    <Form.Select fluid placeholder='نوع طرح' label='نوع طرح' search selection error={this.state.formValidation.design} onChange={this.selectChange} name="design" options={this.state.design_Options} />
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
                            content="ثبت محصول"
                            onClick={this.formSubmitHandler}
                        />
                    </Modal.Actions>
                </Modal>
                    
            </div>
        );
  }
}

const mapStateToProps = state => {
    // console.log('state',state)
  return {
        productFields: state.depository.productFields,
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
  { getProductFields,setNewProduct }
)(AddBillModal);
