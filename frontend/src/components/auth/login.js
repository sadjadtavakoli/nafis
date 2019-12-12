/* eslint-disable */
import React from "react";
import { connect } from "react-redux";
import { Button, Container, Divider, Form, Grid, Segment } from 'semantic-ui-react'
import logo from '../../assets/logo.png'
import history from "../../history";

import {login} from "../../actions/LoginActions";
// import {toastr} from 'react-redux-toastr'

class Login extends React.Component {
    state = {
        username: '',
        password: '',
        hasError: false,
        isPendingToRecieveData:false
    }
    inputOnChange = (values) => { 
        this.setState({hasError:false})
        this.setState({
            [values.target.id]:values.target.value
        })
    }
    onSubmit = () => {
        console.log(this.state);

        this.setState({ isPendingToRecieveData: true });
        this.props.login(this.state.username, this.state.password).then(()=>{
            this.setState({ isPendingToRecieveData: false });
            history.push('/');
            // toastr.success('ورود موفق آمیز','ورود با موفقیت انجام شد')
        }).catch(() => {
            this.setState({isPendingToRecieveData: false, hasError:true})
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
                        error={this.state.hasError}
                        className="ltr placeholder-rtl"
                        id="username"
                        onChange={this.inputOnChange}
                        icon='user'
                        iconPosition='left'
                        label='نام کاربری'
                        placeholder='نام کاربری'
                        />
                    <Form.Input
                        error={this.state.hasError}
                        className="ltr placeholder-rtl"
                        id="password"
                        onChange={this.inputOnChange}
                        icon='lock'
                        iconPosition='left'
                        label='گذرواژه'
                        type='password'
                        placeholder='گذرواژه'            
                    />

                    <Button loading={this.state.isPendingToRecieveData} onClick={this.onSubmit} className="yekan" content='ورود به سامانه' primary />
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
