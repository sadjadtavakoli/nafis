import React from "react";
import { connect } from "react-redux";
import { Button, Form, Card } from 'semantic-ui-react'

class NewBillPopup extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        product: '',
        amount: '',
        end_of_roll: false,
        discount: 0,
        end_of_roll_amount: ''
    }
    changeInput = (event, inputName)=>{
        this.setState({ [inputName]: event.target.value });
    }
    toggleIsEndOfRoll = () => {
        this.setState((prevState)=>({end_of_roll: !prevState.end_of_roll,end_of_roll_amount:''}))
    }
    submitForm = () => {
        if (this.state.product.length < 1 || this.state.amount.length < 1 || this.state.discount.length < 1 || (this.state.end_of_roll && this.state.end_of_roll_amount.length < 1)) {
            alert('فرم افزودن آیتم معتبر نبوده است');
        } else {
            this.props.onSubmit(this.state)
        }
    }
    render() {
        return (
            <Card className="rtl" fluid key={0}>
                <Card.Content>
                    <Card.Header className='yekan'>افزودن آیتم جدید</Card.Header>
                </Card.Content>
                <Card.Content extra>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Input className='ltr placeholder-rtl' type="number" fluid label='کد محصول' onChange={(e)=>this.changeInput(e,'product')} placeholder='' />
                            <Form.Input className='ltr placeholder-rtl' type="number" fluid label='مقدار(متر)' onChange={(e)=>this.changeInput(e,'amount')} placeholder='' />
                            <Form.Input className='ltr placeholder-rtl' type="number" fluid label='تخفیف' defaultValue={this.state.discount}  onChange={(e)=>this.changeInput(e,'discount')} placeholder='' />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Checkbox toggle className='ltr placeholder-rtl' checked={this.state.end_of_roll} onChange={this.toggleIsEndOfRoll} label='ته طاقه؟' />
                            <Form.Input type="number" className={`ltr placeholder-rtl ${this.state.end_of_roll ? '' : 'invisible'}`} onChange={(e)=>this.changeInput(e,'end_of_roll_amount')} label='مقدار ته طاقه' placeholder='مقدار ته طاقه' />
                        </Form.Group>
                                                        
                        <div className="text-center">
                            <Button.Group className="ltr" >
                                <Button className="yekan" onClick={this.props.onClose}>بستن&nbsp;&nbsp;&nbsp;</Button>
                                <Button.Or text='یا' />
                                <Button className="yekan" onClick={this.submitForm} positive>افزودن</Button>
                            </Button.Group>
                        </div>
                    </Form>
                </Card.Content>
            </Card>);
    }
                                        
}


export default connect(
    null,
    null
)(NewBillPopup);
