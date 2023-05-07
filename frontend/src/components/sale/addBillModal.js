import React from 'react'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import {
  Button,
  Card,
  Divider,
  Form,
  Header,
  Icon,
  Label,
  Message,
  Modal,
  Popup,
  Segment,
} from 'semantic-ui-react'
import { getCustomerByPhoneNumber, setNewBill } from '../../actions/SaleActions'
import { digitToComma, enToFa, priceToPersian } from '../utils/numberUtils'
import NewBillPopup from './newBillPopup'
const INITIAL_STATE = {
  sumProductTotalPrice: 0,
  isOpenAddItem: false,
  formValidation: {
    phone_number: false,
    branch: false,
    discount: false,
    items: false,
  },
  phone_number: '',
  branch: 1,
  discount: 0,
  itemsDataSheet: [],
  branchOptions: [{ key: '1', value: '1', flag: 'ir', text: 'شعبه یک' }],
  customerData: {},
}

class AddBillModal extends React.Component {
  state = INITIAL_STATE

  toggleAddItemPopup = () => {
    this.setState((prevState) => ({ isOpenAddItem: !prevState.isOpenAddItem }))
  }

  deleteItem = (id) => {
    var r = window.confirm('آیا از حذف این مورد مطمئن هستید؟')
    if (!!r) {
      let _newItemsDataSheet = []
      let itemsDataSheet = JSON.parse(JSON.stringify(this.state.itemsDataSheet))
      console.log(this.state.itemsDataSheet)
      for (var i = 0; i < itemsDataSheet.length; i++) {
        console.log(id, i, itemsDataSheet)
        if (i !== id) {
          _newItemsDataSheet.push(itemsDataSheet[i])
        }
      }
      console.log('_newItemsDataSheet', _newItemsDataSheet, id)
      this.setState({ itemsDataSheet: _newItemsDataSheet }, () => {
        this.sumProductTotalPrice()
      })
    }
  }

  Item = (data, id) => {
    return (
      <Card fluid key={id}>
        <Card.Content>
          <Card.Header className="yekan bill-header-title">
            <span>{data.name}</span>
            <span>
              <Label
                color="red"
                onClick={() => this.deleteItem(id)}
                className="pointer"
                style={{ marginRight: 10 }}
              >
                <Icon name="trash" /> حذف قلم
              </Label>
            </span>
          </Card.Header>
          <Card.Description className="yekan">
            <Message compact size="mini" color="teal">
              داده های زیر صرفا جهت خواندن هستند و برای جلوگیری از اشتباهات
              انسانی قابل تغییر نمی باشند.{' '}
            </Message>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Form>
            <Form.Group widths="equal">
              <Form.Input
                className="ltr placeholder-rtl"
                readOnly
                fluid
                value={data.name}
                label="نام محصول"
                placeholder=""
              />
              <Form.Input
                className="ltr placeholder-rtl"
                readOnly
                fluid
                value={data.product}
                label="کد محصول"
                readOnly
              />
              <Form.Input
                className="ltr placeholder-rtl"
                readOnly
                fluid
                value={priceToPersian(data.selling_price)}
                label="قیمت واحد"
              />
              <Form.Input
                className="ltr placeholder-rtl"
                readOnly
                type="number"
                fluid
                value={data?.amount}
                step="0.1"
                min={0}
                max={Number(data?.stock_amount)}
                onKeyPress={(event) => event.charCode >= 48}
                label={`مقدار(متر)`}
              />
              <Form.Input
                className="ltr placeholder-rtl"
                readOnly
                fluid
                value={priceToPersian(data.discount)}
                label="تخفیف"
              />
            </Form.Group>
            <Form.Group widths="3">
              <Form.Checkbox
                toggle
                className="ltr placeholder-rtl"
                readOnly
                checked={data.end_of_roll}
                label="ته طاقه؟"
              />
              <Form.Input
                className={`ltr placeholder-rtl ${
                  data.end_of_roll ? '' : 'invisible'
                }`}
                readOnly
                value={data.end_of_roll_amount}
                label="مقدار حساب شده"
                placeholder="مقدار حساب شده"
              />
            </Form.Group>
          </Form>
        </Card.Content>
      </Card>
    )
  }

  submitItemPopup = (data) => {
    this.setState(
      {
        itemsDataSheet: [data, ...this.state.itemsDataSheet],
        formValidation: { ...this.state.formValidation, items: false },
      },
      () => {
        this.sumProductTotalPrice()
      }
    )
    this.toggleAddItemPopup()
  }

  getCustomerData(phone_number) {
    if (phone_number.length === 11) {
      this.props.getCustomerByPhoneNumber(phone_number).then(({ data }) => {
        this.setState({ customerData: data })
      })
    }
  }

  inputChange = (event, inputName) => {
    this.setState(
      {
        [inputName]: event.target.value,
      },
      () => {
        if (inputName === 'phone_number') {
          if (this.state.phone_number.length === 11) {
            this.getCustomerData(this.state.phone_number)
          } else {
            this.setState({ customerData: {} })
          }
        }
      }
    )
  }

  sumProductTotalPrice = () => {
    let preSumArray = []
    let sum = 0
    if (this.state.itemsDataSheet)
      preSumArray = this.state?.itemsDataSheet.map((item) => {
        let finalAmount = !!item?.end_of_roll_amount
          ? item?.end_of_roll_amount
          : item?.amount
        return Number(
          item?.selling_price * finalAmount - item?.discount * finalAmount
        )
      })
    preSumArray.forEach((item) => {
      sum += item
    })
    this.setState({ sumProductTotalPrice: sum })
  }

  formSubmitHandler = () => {
    this.setState(
      {
        formValidation: {
          ...this.state.formValidation,
          discount: false,
          phone_number: false,
          items: false,
        },
      },
      () => {
        let hasError = false
        if (this.state.phone_number.length !== 11) {
          this.setState({
            formValidation: {
              ...this.state.formValidation,
              phone_number: true,
            },
          })
          hasError = true
        }

        if (this.state.discount.length < 1) {
          this.setState({
            discount: 0,
          })
          hasError = true
        }
        if (this.state.itemsDataSheet.length < 1) {
          this.setState({
            formValidation: { ...this.state.formValidation, items: true },
          })
          hasError = true
        }
        if (!hasError) {
          const prepareData = {
            phone_number: this.state.phone_number,
            discount: this.state.discount,
            branch: this.state.branch,
            items: this.state.itemsDataSheet,
          }
          this.props.setNewBill(prepareData).then(() => {
            this.setState(INITIAL_STATE)
            this.props.onClose()
            toastr.success('ثبت فاکتور جدید', 'فاکتور جدید با موفقیت ثبت شد')
          })
        }
      }
    )
  }
  isHideHandler = (id) => {
    console.log('in isHideHandler', this.state.itemsDataSheet[id])
    if (
      this.state.itemsDataSheet[id] &&
      this.state.itemsDataSheet[id].isHide === false
    ) {
      return 'block'
    } else {
      return 'none'
    }
  }
  render() {
    return (
      <React.Fragment>
        <Modal
          id="add-bill"
          closeOnDimmerClick={false}
          dimmer="blurring"
          className="text-right rtl yekan"
          open={this.props.open}
          onClose={this.props.onClose}
        >
          <Modal.Header className="yekan">ثبت فاکتور جدید</Modal.Header>
          <Modal.Content scrolling>
            <Modal.Description>
              {Object.keys(this.state.customerData).length > 0 ? (
                <Label color="blue">
                  <span>امتیاز مشتری:&nbsp;</span>
                  <span>{enToFa(String(this.state.customerData.points))}</span>
                  <span>&nbsp;امتیاز</span>
                </Label>
              ) : (
                <Label className="invisible">
                  <span>ا</span>
                </Label>
              )}
              <Form>
                <Form.Group unstackable widths={2}>
                  <Form.Input
                    className="ltr placeholder-rtl"
                    label="شماره تلفن همراه"
                    type="number"
                    error={this.state.formValidation.phone_number}
                    onChange={(e) => this.inputChange(e, 'phone_number')}
                    placeholder="شماره تلفن همراه"
                  />
                  <Form.Dropdown
                    className="ltr placeholder-rtl text-right"
                    defaultValue={'1'}
                    placeholder="شعبه"
                    selection
                    label="شعبه"
                    options={this.state.branchOptions}
                  />
                </Form.Group>
                <Segment>
                  <Header as="h3" floated="right">
                    <span>اقلام</span>{' '}
                    <Label className="norm-latin">
                      <span className="yekan">مبلغ کل اقلام:&nbsp;</span>
                      <span>
                        {digitToComma(
                          Math.round(this.state.sumProductTotalPrice)
                        )}
                      </span>
                      <span className="yekan">&nbsp;تومان</span>
                    </Label>
                  </Header>

                  <Divider clearing />
                  <Message
                    negative
                    className={this.state.formValidation.items ? '' : 'd-none'}
                  >
                    <Message.Header className="yekan">
                      خطا در تکمیل فاکتور
                    </Message.Header>
                    <p>
                      جهت تکمیل فرم، فاکتور شما حتما باید حاوی حداقل یک قلم باشد
                    </p>
                  </Message>
                  <div className="text-center padded">
                    <Popup
                      style={{ top: -70 }}
                      content={
                        <NewBillPopup
                          onClose={this.toggleAddItemPopup}
                          onSubmit={this.submitItemPopup}
                        />
                      }
                      open={this.state.isOpenAddItem}
                      className="no-filter"
                      position="bottom center"
                      wide="very"
                      trigger={
                        <Button
                          circular
                          onClick={() => {
                            this.toggleAddItemPopup(this.state.isOpenAddItem)
                          }}
                          color="green"
                          size="huge"
                          icon="add"
                        />
                      }
                    />
                  </div>
                  {this.state.itemsDataSheet.map((item, index) => {
                    return (
                      <Card.Group key={index}>
                        <div
                          style={{
                            display: this.isHideHandler(index),
                            margin: '4px 8px',
                          }}
                        >
                          {this.Item(item, index)}
                        </div>
                      </Card.Group>
                    )
                  })}
                </Segment>
                <Form.Group widths={2}>
                  <Form.Input
                    className="ltr placeholder-rtl"
                    label="تخفیف کلی"
                    type="number"
                    error={this.state.formValidation.discount}
                    onChange={(e) => this.inputChange(e, 'discount')}
                    placeholder="مقدار تخفیف"
                  />
                  <Form.Input
                    className="rtl placeholder-rtl text-right"
                    label="قیمت نهایی فاکتور"
                    type="text"
                    readOnly
                    value={`${digitToComma(
                      Math.round(
                        this.state.sumProductTotalPrice - this.state.discount
                      )
                    )} تومان`}
                  />
                </Form.Group>
              </Form>
            </Modal.Description>
          </Modal.Content>

          <Modal.Actions>
            <Button
              className="yekan"
              positive
              icon="checkmark"
              labelPosition="right"
              content="ثبت فاکتور"
              onClick={this.formSubmitHandler}
            />
            <Button
              color="black"
              onClick={() => {
                this.props.onClose()
                this.setState(INITIAL_STATE)
              }}
            >
              <span>بستن</span>
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}

export default connect(null, { setNewBill, getCustomerByPhoneNumber })(
  AddBillModal
)
