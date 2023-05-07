import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Container,
  Divider,
  Form,
  Grid,
  Segment
} from "semantic-ui-react";
import logo from "../../assets/logo.png";
import history from "../../history";

import { login } from "../../actions/LoginActions";

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    hasError: false,
    isPendingToRecieveData: false
  };
  inputOnChange = values => {
    this.setState({ hasError: false });
    this.setState({
      [values.target.id]: values.target.value
    });
  };
  onSubmit = () => {
    this.setState({ isPendingToRecieveData: true });
    this.props
      .login(this.state.username, this.state.password)
      .then(() => {
        this.setState({ isPendingToRecieveData: false });
        history.push("/");
      })
      .catch(() => {
        this.setState({ isPendingToRecieveData: false, hasError: true });
      });
  };

  render() {
    return (
      <Container id="login" className="rtl">
        <Segment placeholder>
          <Grid columns={2} relaxed="very" stackable>
            <Grid.Column
              className="ltr text-center only-device"
              verticalAlign="middle"
            >
              <img src={logo} height="230" alt="logo" />
            </Grid.Column>
            <Grid.Column>
              <Form>
                <Form.Input
                  error={this.state.hasError}
                  className="ltr placeholder-rtl"
                  id="username"
                  onChange={this.inputOnChange}
                  icon="user"
                  iconPosition="left"
                  label="نام کاربری"
                  placeholder="نام کاربری"
                />
                <Form.Input
                  error={this.state.hasError}
                  className="ltr placeholder-rtl"
                  id="password"
                  onChange={this.inputOnChange}
                  icon="lock"
                  iconPosition="left"
                  label="گذرواژه"
                  type="password"
                  placeholder="گذرواژه"
                />

                <Button
                  loading={this.state.isPendingToRecieveData}
                  onClick={this.onSubmit}
                  className="yekan"
                  content="ورود به سامانه"
                  primary
                />
              </Form>
            </Grid.Column>

            <Grid.Column
              className="ltr text-center only-desktop"
              verticalAlign="middle"
            >
              <img src={logo} alt="logo" height="230" />
            </Grid.Column>
          </Grid>

          <Divider vertical></Divider>
        </Segment>
      </Container>
    );
  }
}

export default connect(null, { login })(Login);
