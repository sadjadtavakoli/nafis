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
import { toastr } from "react-redux-toastr";

const INITIAL_STATE = {
  sumProductTotalPrice: 0,
  data: {},
  isOpenAddItem: false,
  formValidation: {},
  phone_number: "",
  used_points: "",
  branch: 1,
  discount: 0,
  editting: "",
  branchOptions: [{ key: "1", value: "1", flag: "ir", text: "شعبه یک" }],
  isEnableEdit: {
    discount: false,
    used_points: false
  },
  customerData: {},
  editedData: {
    name: "",
    code: "",
    selling_price: "",
    amount: "",
    discount: "",
    end_of_roll_amount: "",
    end_of_roll: ""
  }
};

class ShowInformationModal extends React.Component {
  state = INITIAL_STATE;

  componentDidMount() {
    this.syncStateWithProps();
  }

  syncStateWithProps() {
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
          toastr.success("حذف آیتم با موفقیت انجام شد");
        })
        .catch(() => {
          toastr.error("خطا در فرایند حذف آیتم");
        });
    }
  };

  editItem = index => {
    this.setState({
      editting: index,
      editMode: true
    });
  };

  submitChanges = () => {
    let noChanges = false;
    let prepareData = {
      name: this.state.editedData.name,
      code: this.state.editedData.code,
      selling_price: this.state.editedData.selling_price,
      amount: this.state.editedData.amount,
      discount: this.state.editedData.discount,
      end_of_roll_amount: this.state.editedData.end_of_roll_amount,
      end_of_roll: this.state.editedData.end_of_roll
    };
    if (
      !this.state.editedData.name ||
      !this.state.editedData.code ||
      !this.state.editedData.selling_price ||
      !this.state.editedData.amount ||
      !this.state.editedData.discount ||
      !this.state.editedData.end_of_roll_amount ||
      !this.state.editedData.end_of_roll
    ) {
      noChanges = true;
    }
    if (noChanges) {
      window.alert("هیچ تغیری اعمال نشده است.");
    } else {
      this.props.updateBill(this.state.data.pk, prepareData).then(() => {
        this.setState({
          editting: "",
          editMode: false
        });
        this.props.refetch();
      });
    }
  };

  cancelChanges = () => {
    this.setState({
      name: "",
      code: "",
      selling_price: "",
      amount: "",
      discount: "",
      end_of_roll_amount: "",
      end_of_roll: "",
      editMode: false,
      editting: ""
    });
  };

  inputChange = (event, inputName) => {
    this.setState({
      [inputName]: event.target.value
    });
    if (inputName === "phone_number") {
      this.getCustomerData(event.target.value);
    }
  };

  getCustomerData = phone_number => {
    if (phone_number.length === 11) {
      this.props.getCustomerByPhoneNumber(phone_number).then(({ data }) => {
        this.setState({ customerData: data });
      });
    }
  };

  edit = inputName => {
    let prepareData = {
      discount: Number(this.state.discount),
      used_points: Number(this.state.used_points)
    };
    this.props.updateBill(this.state.data.pk, prepareData).then(() => {
      this.setState(
        {
          discount: Number(this.state.discount),
          used_points: Number(this.state.used_points)
        },
        () => {
          console.log("used points", this.state.used_points);
        }
      );
      this.props.refetch();
    });
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
        this.props
          .updateBill(this.state.data.pk, {
            used_points: Number(this.state.used_points)
          })
          .then(() => {
            this.setState({ used_points: Number(this.state.used_points) });
            this.props.refetch();
          });
      }
    } else if (inputName === "discount") {
      this.props
        .updateBill(this.state.data.pk, {
          discount: Number(this.state.discount)
        })
        .then(() => {
          this.setState({ discount: Number(this.state.discount) });
          this.props.refetch();
        });
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
    this.setState({ ...this.state, data: response.data }, () => {
      this.sumProductTotalPrice();
    });
  };

  sumProductTotalPrice = () => {
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

  handleChange = (e, status) => {
    this.setState({
      editedData: {
        [status]: e.target.value
      }
    });
  };

  itemsRender = (item, index) => {
    return (
      <Card.Group key={index} id="s-showInfromationModel">
        <Card fluid>
          <Card.Content>
            <Card.Header className="yekan">
              {item.product.name}
              {!this.state.editMode ? (
                <Button
                  icon
                  color="red"
                  onClick={() => this.deleteItem(index)}
                  className="pointer"
                  labelPosition="right"
                  size="mini"
                  style={{ marginRight: "10px" }}
                >
                  <span>حذف آیتم</span>
                  <Icon name="trash" />
                </Button>
              ) : null}
              {this.state.editMode ? null : (
                <Button
                  icon
                  color="teal"
                  onClick={() => this.editItem(index)}
                  className="pointer"
                  labelPosition="right"
                  size="mini"
                  style={{ marginRight: "10px" }}
                >
                  <span>ویرایش</span>
                  <Icon name="edit" />
                </Button>
              )}
              {!this.state.editMode ? (
                <Message
                  compact
                  size="mini"
                  color="teal"
                  className="yekan form-message"
                >
                  جهت ویرایش این قسمت روی دکمه ی ویرایش کلیک کنید.
                </Message>
              ) : null}
            </Card.Header>
          </Card.Content>
          <Card.Content>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  className="rtl text-right placeholder-rtl"
                  readOnly={this.state.editting !== index ? true : false}
                  fluid
                  defaultValue={item.product.name}
                  onChange={e => this.handleChange(e, "name")}
                  label="نام محصول"
                />
                <Form.Input
                  className="ltr placeholder-rtl"
                  readOnly={this.state.editting !== index ? true : false}
                  fluid
                  defaultValue={item.product.code}
                  onChange={e => this.handleChange(e, "code")}
                  label="کد محصول"
                />
                <Form.Input
                  className="ltr placeholder-rtl"
                  readOnly={this.state.editting !== index ? true : false}
                  fluid
                  defaultValue={priceToPersian(item.product.selling_price)}
                  onChange={e => this.handleChange(e, "selling_price")}
                  label="قیمت واحد"
                />
                <Form.Input
                  className="ltr placeholder-rtl"
                  readOnly={this.state.editting !== index ? true : false}
                  fluid
                  defaultValue={item.amount}
                  onChange={e => this.handleChange(e, "amount")}
                  label={`مقدار(متر)`}
                />
                <Form.Input
                  className="ltr placeholder-rtl"
                  readOnly={this.state.editting !== index ? true : false}
                  fluid
                  defaultValue={item.discount}
                  onChange={e => this.handleChange(e, "discount")}
                  label="تخفیف"
                />
              </Form.Group>
              <Form.Group>
                <Form.Input
                  className={`ltr placeholder-rtl ${
                    item.end_of_roll ? "" : "hidden"
                  }`}
                  readOnly={this.state.editting !== index ? true : false}
                  defaultValue={item.end_of_roll_amount}
                  onChange={e => this.handleChange(e, "end_of_roll_amount")}
                  label="مقدار حساب شده"
                />
                <Form.Checkbox
                  toggle
                  className="ltr placeholder-rtl"
                  readOnly={this.state.editting !== index ? true : false}
                  checked={item.end_of_roll}
                  onChange={e => this.handleChange(e, "end_of_roll")}
                  label="ته طاقه؟"
                />
              </Form.Group>
              {this.state.editting !== index ? null : (
                <React.Fragment>
                  <Button color="green" onClick={this.submitChanges}>
                    <span>اعمال</span>
                  </Button>
                  <Button color="gray" onClick={this.cancelChanges}>
                    <span>لغو</span>
                  </Button>
                </React.Fragment>
              )}
            </Form>
          </Card.Content>
        </Card>
      </Card.Group>
    );
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

  render() {
    return Object.keys(this.state.data).length > 0 ? (
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
                <Form.Input
                  className="ltr placeholder-rtl"
                  readOnly={!this.state.isEnableEdit.used_points}
                  error={!this.state.isEnableEdit.used_points}
                  defaultValue={this.state.data.used_points}
                  label={() =>
                    this.labelRender("امتیاز استفاده شده", "used_points")
                  }
                  type="number"
                  onChange={e => this.inputChange(e, "used_points")}
                  placeholder="امتیاز استفاده شده"
                />
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
            disabled={this.state.editMode ? true : false}
          >
            <span>بستن</span>
          </Button>
        </Modal.Actions>
      </Modal>
    ) : (
      <React.Fragment></React.Fragment>
    );
  }
}

export default connect(null, {
  setNewBill,
  deleteItem,
  getCustomerByPhoneNumber,
  updateBill
})(ShowInformationModal);
