import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, Form, Icon } from 'semantic-ui-react'
import {
  getACustomer,
  getClassTypes,
  updateCustomer,
} from '../../actions/CustomersActions'
import history from '../../history'
import SingleDatePickerModal from '../utils/SingleDatePickerModal'
class EditTab extends Component {
  state = {
    inputNameForDatePicker: '',
    titleForDatePicker: '',
    calendarIsOpen: false,
    pk: null,
    first_name: '',
    last_name: '',
    email: '',
    phone_number: null,
    address: null,
    city: null,
    birth_date: null,
    marriage_date: null,
    points: 0,
    class_type: null,
    first_name_b: false,
    last_name_b: false,
    email_b: false,
    phone_number_b: false,
    address_b: false,
    city_b: false,
    birth_date_b: false,
    marriage_date_b: false,
    points_b: false,
    class_type_b: false,
    first_name_e: false,
    last_name_e: false,
    email_e: false,
    phone_number_e: false,
    address_e: false,
    city_e: false,
    birth_date_e: false,
    marriage_date_e: false,
    points_e: false,
    class_type_e: false,
    city_options: [],
    class_options: [],
    anyChange: false,
  }

  componentDidMount() {
    this.getCustomerInfo()
  }

  getCustomerInfo = () => {
    this.props.getACustomer(this.props.passingPk).then(() => {
      this.setState({
        pk: this.props.passingPk,
        first_name: this.props.theCustomer.first_name,
        last_name: this.props.theCustomer.last_name,
        email: this.props.theCustomer.email,
        phone_number: this.props.theCustomer.phone_number,
        address: this.props.theCustomer.address,
        birth_date: this.props.theCustomer.birth_date,
        marriage_date: this.props.theCustomer.marriage_date,
        points: this.props.theCustomer.points,
        city: this.props.theCustomer.city && this.props.theCustomer.city.pk,
        class_type:
          this.props.theCustomer.class_type &&
          this.props.theCustomer.class_type.pk,
      })
    })
    this.props.getClassTypes().then(() => {
      this.setState({
        city_options: this.props.cityAndClass.cities,
        class_type_options: this.props.cityAndClass.customerTypes,
      })
    })
  }

  convertStatus = (status) => {
    return status.concat('_b')
  }

  convertStatusE = (status) => {
    return status.concat('_e')
  }

  convertSelect = (status) => {
    return status.replace('_options', '')
  }

  handleChange = (status, e) => {
    this.setState({
      [status]: e.target.value,
      [`${status}_e`]: false,
      anyChange: true,
      hasError: false,
    })
  }

  validateEmail = (email) => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  handleSubmit = () => {
    let hasError = false
    let email = this.validateEmail(this.state.email)
    // if (!this.state.first_name) {
    //   this.setState({
    //     first_name_e: true,
    //   })
    //   hasError = true
    // }
    if (!this.state.last_name) {
      this.setState({
        last_name_e: true,
      })
      hasError = true
    }
    if (this.state.phone_number.length !== 11) {
      this.setState({
        phone_number_e: true,
      })
      hasError = true
    }
    if (this.state.email) {
      if (!email) {
        this.setState({
          email_e: true,
        })
        hasError = true
      }
    }
    if (hasError) {
      this.setState({
        hasError: true,
      })
    }
    if (!hasError) {
      let prepareData = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        phone_number: this.state.phone_number,
        address: this.state.address,
        city: this.state.city,
        birth_date: this.state.birth_date,
        marriage_date: this.state.marriage_date,
        points: this.state.points,
        class_type: this.state.class_type,
      }
      this.props
        .updateCustomer(this.state.pk, prepareData)
        .then(() => {
          toastr.success('.عملیات ویرایش با موفقیت انجام شد')
          this.getCustomerInfo()
          if (this.props.onClose !== undefined) {
            this.props.onClose()
          }
        })
        .catch(() => {
          toastr.error('.عملیات ویرایش موفقیت آمیز نبود')
        })
    }
  }

  handleSelect = (status) => {
    let convert = this.convertStatus(status)
    let convertE = this.convertStatusE(status)
    this.setState({
      [convert]: true,
      [convertE]: false,
      hasError: false,
    })
  }

  handleBlur = (status) => {
    let convert = this.convertStatus(status)
    this.setState({
      [convert]: false,
    })
  }

  createInput = (status, title, hasDatePicker = false) => {
    let convert = this.convertStatus(status)
    let convertE = this.convertStatusE(status)
    return (
      <React.Fragment>
        <Form.Input
          className={`text-right`}
          label={title}
          onChange={(e) => this.handleChange(status, e)}
          onInput={(e) => this.handleChange(status, e)}
          onBlur={() => this.handleBlur(status)}
          defaultValue={this.state[convert] ? null : this.state[status]}
          placeholder={this.state[convert] ? this.state[status] : null}
          error={this.state[convertE]}
          readOnly={
            hasDatePicker ||
            (status === 'phone_number' || status === 'points'
              ? localStorage.getItem('type') === 'cashier'
                ? true
                : false
              : false)
          }
        />
        {hasDatePicker ? (
          <Icon
            style={{ margin: 'auto', paddingTop: '0.4em' }}
            onClick={() => {
              this.setState(
                {
                  inputNameForDatePicker: status,
                  anyChange: true,
                  titleForDatePicker: `انتخاب ${title}`,
                },
                () => {
                  this.handleCalendarClick(true)
                }
              )
            }}
            name="calendar alternate outline"
            color="teal"
            size="big"
            className="date-picker-icon"
          />
        ) : null}
      </React.Fragment>
    )
  }
  selectOnChange = (e, { name, value }) => {
    let status = this.convertSelect(name)
    this.setState({
      ...this.state,
      [status]: value,
      anyChange: true,
    })
  }
  createSelect = (status, title) => {
    let convertSelect = this.convertSelect(status)
    return (
      <Form.Select
        name={status}
        search
        selection
        fluid
        className="text-right"
        label={title}
        placeholder={title}
        onChange={this.selectOnChange}
        options={this.state[status]}
        value={this.state[convertSelect]}
        defaultValue={this.state[convertSelect]}
      />
    )
  }
  setDate = (inputName, selectedDate) => {
    this.setState({
      [inputName]: selectedDate,
      calendarIsOpen: false,
    })
  }
  handleCalendarClick = (status) => {
    this.setState({
      calendarIsOpen: status,
    })
  }
  render() {
    return (
      <div className="rtl text-right">
        <Form>
          <SingleDatePickerModal
            title={this.state.titleForDatePicker}
            onClose={() => this.handleCalendarClick(false)}
            isOpen={this.state.calendarIsOpen}
            inputName={this.state.inputNameForDatePicker}
            setDate={this.setDate}
          />
          <Form.Group unstackable widths={2}>
            {this.createInput('first_name', 'نام')}
            {this.createInput('last_name', 'نام خانوداگی')}
          </Form.Group>
          {!this.props.fromCashregister ? (
            <Form.Group unstackable widths={2}>
              {this.createInput('email', 'ایمیل')}
              {this.createInput('address', 'آدرس')}
            </Form.Group>
          ) : null}
          <Form.Group unstackable widths={2}>
            {this.createInput('phone_number', 'شماره تلفن')}
            {this.createSelect('city_options', 'شهر')}
          </Form.Group>
          <Form.Group unstackable widths={2}>
            {this.createInput('birth_date', 'تاریخ تولد', true)}
            {this.createInput('marriage_date', 'تاریخ ازدواج', true)}
          </Form.Group>
          {!this.props.fromCashregister ? (
            <Form.Group unstackable widths={2}>
              {this.createInput('points', 'امتیاز مشتری')}
              {this.createSelect('class_type_options', 'کلاس')}
            </Form.Group>
          ) : null}
          <Button
            onClick={this.handleSubmit}
            disabled={this.state.anyChange ? false : true}
            color={this.state.hasError ? 'red' : 'green'}
            icon="checkmark"
            labelPosition="right"
            content="اعمال"
            className="yekan"
          />
          <Button
            className="yekan"
            content={this.props.fromCashregister ? 'بستن' : 'بازگشت'}
            onClick={() => {
              if (this.props.onClose !== undefined) {
                this.props.onClose()
              } else {
                history.push('/customers/')
              }
            }}
          />
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    theCustomer: state.customers.theCustomer,
    cityAndClass: state.customers.classTypesAndCity,
  }
}

export default connect(mapStateToProps, {
  getACustomer,
  updateCustomer,
  getClassTypes,
})(EditTab)
