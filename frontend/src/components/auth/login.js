import React from "react";
import { connect } from "react-redux";
import { Button, Container, Divider, Form, Grid, Segment } from 'semantic-ui-react'
import logo from '../../assets/logo.png'
// import logo from '../../../assets/logo.png'; // Tell Webpack this JS file uses this image

// import "./index.scss";

// import Form from "../../Form";
// import {login} from "../../../actions";
// import {toastr} from 'react-redux-toastr'

// const FORM_VALUES = {
//     submitText: "ورود به سامانه",
//     form_inputs: [
//         {
//             title: "username",
//             label: "نام کاربری",
//             type:"text"
//         }, {
//             title: "password",
//             label: "گذرواژه",
//             type: "password"
//         }
//     ]
// };

class Login extends React.Component {

    onSubmit = (values) => {
        // this.props.login(values.username, values.password).then(()=>{
        //     toastr.success('ورود موفق آمیز','ورود با موفقیت انجام شد')
        // }).catch(() => {
        //     toastr.error('خطا','چنین کاربری در سامانه موجود نمی باشد')
        // });
    };

    render() {
        return (
        <Container id="login" className="rtl">
           <Segment placeholder>
                <Grid columns={2} relaxed='very' stackable>
                <Grid.Column>
                    <Form>
                    <Form.Input
                        className="placeholder-rtl"
                        icon='user'
                        iconPosition='left'
                        label='نام کاربری'
                        placeholder='نام کاربری'
                    />
                    <Form.Input
                        className="placeholder-rtl"
                        icon='lock'
                        iconPosition='left'
                        label='گذرواژه'
                        type='password'
                        placeholder='گذرواژه'            
                    />

                    <Button content='ورود به سامانه' primary />
                    </Form>
                </Grid.Column>

                        <Grid.Column className="ltr" verticalAlign='middle'>
                            <img src={logo} height="230"/>
                    {/* <Button content='ثبت نام' icon='signup' size='big' /> */}
                </Grid.Column>
                </Grid>

                <Divider vertical></Divider>
            </Segment>
        </Container>
        );
    }
}

export default connect(
    null,
    null,
    // {login}
)(Login);
