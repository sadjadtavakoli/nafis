import React from "react";
import {connect} from "react-redux";
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
            <div className="login__container">
                <div className="login__content-container">
                    {/* <img src={logo} width="200" className="autoShadow" /> */}
                    MASALAN LOGIINE
                    {/* <Form
                        direction={"column"}
                        formValues={FORM_VALUES.form_inputs}
                        onSubmit={this.onSubmit}
                        submitText={FORM_VALUES.submitText}
                        title={FORM_VALUES.title}
                    /> */}
                </div>
            </div>
        );
    }
}

export default connect(
    null,
    null,
    // {login}
)(Login);
