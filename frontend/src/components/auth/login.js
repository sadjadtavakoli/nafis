import React from "react";
import { connect } from "react-redux";
import { Button, Container, Divider, Form, Grid, Segment } from 'semantic-ui-react'
import logo from '../../assets/logo.png'

import {login} from "../../actions/LoginActions";
// import {toastr} from 'react-redux-toastr'

class Login extends React.Component {
    state = {
        username: '',
        password: ''
    }
    inputOnChange = (values) => { 
        this.setState({
            [values.target.id]:values.target.value
        })
    }
    onSubmit = (values) => {
        console.log(this.state)
        this.props.login(this.state.username, this.state.password).then(()=>{
            // toastr.success('ورود موفق آمیز','ورود با موفقیت انجام شد')
        }).catch(() => {
            // toastr.error('خطا','چنین کاربری در سامانه موجود نمی باشد')
        });
    };

    render() {
        return (
        <Container id="login" className="rtl">
           <Segment placeholder>
                <Grid columns={2} relaxed='very' stackable>
                <Grid.Column>
                    <Form>
                    <Form.Input
                        id="username"
                        onChange={this.inputOnChange}
                        icon='user'
                        iconPosition='left'
                        label='نام کاربری'
                        placeholder='نام کاربری'
                    />
                    <Form.Input
                        id="password"
                        onChange={this.inputOnChange}
                        icon='lock'
                        iconPosition='left'
                        label='گذرواژه'
                        type='password'
                        placeholder='گذرواژه'            
                    />

                    <Button onClick={this.onSubmit} className="yekan" content='ورود به سامانه' primary />
                    </Form>
                </Grid.Column>

                        <Grid.Column className="ltr" verticalAlign='middle'>
                            <img src={logo} height="230"/>
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
    {login}
)(Login);
