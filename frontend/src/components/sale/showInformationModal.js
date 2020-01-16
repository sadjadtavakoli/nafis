import React from "react";
import { connect } from "react-redux";
import { enToFa, priceToPersian, digitToComma } from "../utils/numberUtils";
import {
  setNewBill,
  deleteItem,
  getCustomerByPhoneNumber,
  updateBill
} from "../../actions/SaleActions";
import {
  Button,
  Modal,
  Divider,
  Header,
  Segment,
  Form,
  Card,
  Popup,
  Icon,
  Message,
  Label
} from "semantic-ui-react";
import NewBillPopup from "./newBillPopup";
const INITIAL_STATE = {
  sumProductTotalPrice: 0,
  data: {},
  isOpenAddItem: false,
  formValidation: {},
  phone_number: "",
  used_points: "",
  branch: 1,
  discount: 0,
  branchOptions: [{ key: "1", value: "1", flag: "ir", text: "شعبه یک" }],
  isEnableEdit: {
    discount: false,
    used_points: false
  },
  customerData: {}
};
class ShowInformationModal extends React.Component {
  componentWillReceiveProps() {
    if (!this.state.data.items) {
      this.setState(
        { data: this.props.data, discount: this.props.data.discount },
        () => {
          if (this.state.data.buyer) {
            this.getCustomerData(this.state.data.buyer.phone_number);
            this.sumProductTotalPrice();
          }
        }
      );
    }
  }
  state = INITIAL_STATE;
  toggleAddItemPopup = () => {
    this.setState(prevState => ({ isOpenAddItem: !prevState.isOpenAddItem }));
  };
  deleteItem = index => {
    var r = window.confirm("آیا از حذف این مورد مطمئن هستید؟");
    if (r === true) {
      this.props
        .deleteItem(this.state.data.items[index].pk)
        .then(({ data }) => {
          this.setState({ data }, () => {
            this.sumProductTotalPrice();
          });
        });
    }
    deleteItem = (index) => {
        var r = window.confirm("آیا از حذف این مورد مطمئن هستید؟");
        if (r === true) {
            this.props.deleteItem(this.state.data.items[index].pk).then(({ data }) => {
                this.setState({ data }, () => {
                    this.sumProductTotalPrice()
                });
            });
        }
        
  };
  itemsRender = (item, index) => {
    return (
      <Card.Group key={index}>
        <Card fluid>
          <Card.Content>
            <Card.Header className="yekan">
              {item.product.name}
              <span>
                <Label
                  color="red"
                  onClick={() => this.deleteItem(index)}
                  className="pointer"
                  style={{ marginRight: 10 }}
                >
                  <Icon name="trash" /> حذف آیتم
                </Label>
              </span>{" "}
            </Card.Header>
            <Card.Description className="yekan">
              <Message compact size="mini" color="teal">
                داده های زیر صرفا جهت خواندن هستن و برای جلوگیری از خطای انسانی
                قابل ویرایش نمی باشند.
              </Message>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  className="rtl text-right placeholder-rtl"
                  readOnly
                  fluid
                  defaultValue={item.product.name}
                  label="نام محصول"
                  placeholder=""
                />
                <Form.Input
                  className="ltr placeholder-rtl"
                  readOnly
                  fluid
                  defaultValue={item.product.code}
                  label="کد محصول"
                  placeholder=""
                />
                <Form.Input
                  className="ltr placeholder-rtl"
                  readOnly
                  fluid
                  defaultValue={priceToPersian(item.product.selling_price)}
                  label="قیمت واحد"
                  placeholder=""
                />
                <Form.Input
                  className="ltr placeholder-rtl"
                  readOnly
                  fluid
                  defaultValue={item.amount}
                  label={`مقدار(متر)`}
                  placeholder=""
                />
                <Form.Input
                  className="ltr placeholder-rtl"
                  readOnly
                  fluid
                  defaultValue={item.discount}
                  label="تخفیف"
                  placeholder=""
                />
              </Form.Group>
              <Form.Group widths="3">
                <Form.Checkbox
                  toggle
                  className="ltr placeholder-rtl"
                  readOnly
                  checked={item.end_of_roll}
                  label="ته طاقه؟"
                />
                <Form.Input
                  className={`ltr placeholder-rtl ${
                    item.end_of_roll ? "" : "invisible"
                  }`}
                  readOnly
                  defaultValue={item.end_of_roll_amount}
                  label="مقدار حساب شده"
                  placeholder="مقدار حساب شده"
                />
              </Form.Group>
            </Form>
          </Card.Content>
        </Card>
      </Card.Group>
    );
  };
  inputChange = (event, inputName) => {
    this.setState({
      [inputName]: event.target.value
    });
    if (inputName === "phone_number") {
      this.getCustomerData(event.target.value);
    }
  };
  getCustomerData(phone_number) {
    if (phone_number.length === 11) {
      this.props.getCustomerByPhoneNumber(phone_number).then(({ data }) => {
        this.setState({ customerData: data });
      });
    }
  }
  edit = inputName => {
    this.setState({
      isEnableEdit: {
        [inputName]: true
      }
    });
  };
  applyEdit = inputName => {
    this.setState({
      isEnableEdit: {
        ...this.state.isEnableEdit,
        [inputName]: false
      }
    });
    if (inputName === "used_points") {
      if (this.state.used_points > this.state.customerData.points) {
        alert("مقدار امتیاز وارد شده بیش تر از امتیاز مشتری است");
        this.setState({
          data: { ...this.state.data, used_points: this.props.data.used_points }
        });
      } else {
      }
    } else if (inputName === "discount") {
      this.props
        .updateBill(this.state.data.pk, {
          discount: Number(this.state.discount)
        })
        .then(res => {
          this.setState({ discount: Number(this.state.discount) });
          this.props.refetch();
        });
    }
  };
  labelRender = (labelName, inputName) => {
    if (this.state.isEnableEdit[inputName]) {
      return (
        <span
          className="d-flex"
          style={{
            marginBottom: "2.5px",
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          <Label
            onClick={() => this.applyEdit(inputName)}
            className="pointer"
            style={{ marginRight: 10 }}
            size="mini"
            color="green"
          >
            <Icon name="checkmark" /> اعمال
          </Label>
          <span>{labelName}</span>
        </span>
      );
    } else {
      return (
        <span
          className="d-flex"
          style={{
            marginBottom: "2.5px",
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          <Label
            onClick={() => this.edit(inputName)}
            className="pointer"
            style={{ marginRight: 10 }}
            size="mini"
            color="teal"
          >
            <Icon name="edit" /> ویرایش
          </Label>
          <span>{labelName}</span>
        </span>
      );
    }
  };
  submitItemPopup = data => {
    this.setState(
      {
        itemsDataSheet: [...this.state.itemsDataSheet, data],
        formValidation: { ...this.state.formValidation, items: false }
      },
      () => {
        this.sumProductTotalPrice();
      }
    );
    this.toggleAddItemPopup();
  };
  refetchModalData = response => {
    console.log("response", response);
    this.setState({ ...this.state, data: response.data }, () => {
      this.sumProductTotalPrice();
    });
  };
  sumProductTotalPrice = item => {
    let preSumArray = [];
    let sum = 0;
    if (this.state.data.items)
      preSumArray = this.state.data.items.map(item => {
        return Number(item.final_price);
      });
    preSumArray.forEach(item => {
      sum += item;
    });
    this.setState({ sumProductTotalPrice: sum });
  };
  render() {
    return Object.keys(this.state.data).length > 0 ? (
      <div>
        <Modal
          id="add-bill"
          closeOnDimmerClick={false}
          dimmer="blurring"
          className="text-right rtl yekan"
          open={this.props.open}
          onClose={this.props.onClose}
        >
          <Modal.Header className="yekan">فاکتور</Modal.Header>
          <Modal.Content scrolling>
            <Modal.Description>
              <Label color="blue">
                <span>امتیاز مشتری:&nbsp;</span>
                <span>{enToFa(String(this.state.customerData.points))}</span>
                <span>&nbsp;امتیاز</span>
              </Label>
              <Form>
                <Form.Group unstackable widths={2}>
                  <Form.Input
                    className="ltr placeholder-rtl"
                    readOnly
                    defaultValue={this.state.data.buyer.phone_number}
                    label="شماره تلفن همراه"
                    type="number"
                    onChange={e => this.inputChange(e, "phone_number")}
                    placeholder="شماره تلفن همراه"
                  />
                  {/* <Form.Input className='ltr placeholder-rtl' readOnly={!this.state.isEnableEdit.used_points} error={!this.state.isEnableEdit.used_points} defaultValue={this.state.data.used_points} label={()=>this.labelRender('امتیاز استفاده شده','used_points')} type="number" onChange={(e)=>this.inputChange(e,'used_points')} placeholder='امتیاز استفاده شده' /> */}
                </Form.Group>
                <Form.Group widths={2}>
                  <Form.Dropdown
                    className="ltr placeholder-rtl text-right"
                    readOnly
                    defaultValue={"1"}
                    placeholder="شعبه"
                    selection
                    label={"شعبه"}
                    options={this.state.branchOptions}
                  />
                  <Form.Input
                    className="ltr placeholder-rtl"
                    readOnly={!this.state.isEnableEdit.discount}
                    error={!this.state.isEnableEdit.discount}
                    defaultValue={this.state.data.discount}
                    label={() => this.labelRender("تخفیف کلی", "discount")}
                    type="number"
                    onChange={e => this.inputChange(e, "discount")}
                    placeholder="مقدار تخفیف"
                  />
                </Form.Group>
                <Form.Group widths={2}>
                  <Form.Input className="invisible" hidden={true} />
                  <Form.Input
                    className="rtl placeholder-rtl text-right"
                    readOnly={true}
                    label="قیمت نهایی فاکتور"
                    value={`${digitToComma(
                      Math.round(
                        this.state.sumProductTotalPrice - this.state.discount
                      )
                    )} تومان`}
                    type="text"
                  />
                </Form.Group>
                {this.state.data.items &&
                this.state.data.items.length > 0 ? null : (
                  <Message
                    icon="inbox"
                    color="red"
                    header="قلمی در این فاکتور موجود نمی باشد"
                    content={
                      <span>
                        در راستای جلوگیری از خطای انسانی در فرآیند ثبت و ویرایش،
                        جهت افزودن آیتم،توصیه میشود در صفحه‌ی قبلی بروی{" "}
                        <b>افزودن آیتم جدید</b> کلیک نمایید
                      </span>
                    }
                  />
                )}
                <div className="text-center">
                  <Popup
                    style={{ top: -35 }}
                    content={
                      <NewBillPopup
                        onClose={this.toggleAddItemPopup}
                        phoneNumber={this.state.data.buyer.phone_number}
                        refetch={this.refetchModalData}
                        pk={this.state.data.pk}
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
                          this.toggleAddItemPopup(this.state.isOpenAddItem);
                        }}
                        color="green"
                        size="huge"
                        icon="add"
                      />
                    }
                  />
                </div>
                <Segment
                  hidden={
                    this.state.data.items && this.state.data.items.length <= 0
                  }
                >
                  <Header as="h3" floated="right">
                    <span>اقلام فاکتور</span>{" "}
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
                  {this.state.data.items &&
                    this.state.data.items.map((item, index) => {
                      return this.itemsRender(item, index);
                    })}
                </Segment>
              </Form>
            </Modal.Description>
          </Modal.Content>

          <Modal.Actions>
            <Button
              color="black"
              onClick={() => {
                this.props.onClose();
                this.setState(INITIAL_STATE);
              }}
            >
              <span>بستن</span>
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    ) : null;
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

export default connect(mapStateToProps, {
  setNewBill,
  deleteItem,
  getCustomerByPhoneNumber,
  updateBill
})(ShowInformationModal);
