import React from "react";
import { connect } from "react-redux";
import { enToFa, priceToPersian, digitToComma } from "../utils/numberUtils";
import {
  deleteItem,
  getCustomerByPhoneNumber,
  updateBill,
  updateBillItem
} from "../../actions/SaleActions";
import { getOneBill } from "../../actions/CashRegisterActions";
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
import { getProductsByCode } from "../../actions/DepositoryActions";
import NewBillPopup from "./newBillPopup";
import { toastr } from "react-redux-toastr";
import LoadingBar from "../utils/loadingBar";

class InformationModal extends React.Component {
  state = {
    branchOptions: [{ key: "1", value: "1", flag: "ir", text: "شعبه یک" }],
    sumProductTotalPrice: 0,
    isOpenAddItem: false,
    labelEdit: false,
    notFound: null,
    formValidation: {},
    phone_number: "",
    discount: null,
    discount_s: false,
    editting: "",
    editedData: {}
  };

  componentDidMount() {
    this.getOneBill();
  }

  getOneBill = () => {
    this.props.getOneBill(this.props.pk).then(() => {
      this.sumProductTotalPrice();
      this.initializeDiscount();
      console.log(this.props.data);
    });
  };
  sumProductTotalPrice = () => {
    let preSumArray = [];
    let sum = 0;
    if (this.props.data && this.props.data.items.length)
      preSumArray = this.props.data.items.map(item => Number(item.final_price));

    preSumArray.forEach(item => {
      sum += item;
    });
    this.setState({ sumProductTotalPrice: sum });
  };

  initializeDiscount = () => {
    this.setState(
      {
        discount:
          this.props.data.total_discount - this.props.data.items_discount
      },
      () => {
        console.log("total discount", this.props.data.total_discount);
        console.log("items discount", this.props.data.items_discount);
        console.log("state discount", this.state.discount);
      }
    );
  };

  switchToEditMode = () => {
    this.setState({
      labelEdit: true,
      discount_s: true
    });
  };

  handleDiscountChange = e => {
    this.setState({
      discount: Number(e.target.value)
    });
  };

  applyEdit = () => {
    if (
      this.state.discount >
      this.state.sumProductTotalPrice - this.state.discount
    ) {
      alert("مقدار تخفیف وارد شده بیش تر از قیمت نهایی فاکتور است");
      this.setState({
        discount: this.props.data.discount
      });
    } else {
      this.props
        .updateBill(this.props.data.pk, {
          discount: Number(this.state.discount)
        })
        .then(() => {
          this.setState({
            discount: Number(this.state.discount),
            labelEdit: false,
            discount_s: false
          });
          this.props.refetch();
        });
    }
  };

  toggleAddItemPopup = () => {
    this.setState(prevState => ({ isOpenAddItem: !prevState.isOpenAddItem }));
  };

  deleteItem = index => {
    var r = window.confirm("آیا از حذف این مورد مطمئن هستید؟");
    if (r === true) {
      this.props
        .deleteItem(this.props.data.items[index].pk)
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

  submitChanges = pk => {
    let preparedData = {
      code: this.state.editedData.code,
      amount: this.state.editedData.amount,
      discount: this.state.editedData.discount,
      end_of_roll_amount: this.state.editedData.end_of_roll_amount,
      end_of_roll: this.state.editedData.end_of_roll
    };
    this.props.updateBillItem(pk, preparedData).then(() => {
      this.setState({
        editting: "",
        editMode: false
      });
      this.props.refetch();
      this.getOneBill();
    });
  };

  cancelChanges = () => {
    this.setState({
      editMode: false,
      editting: null
    });
    this.props.refetch();
  };

  submitItemPopup = () => {
    this.sumProductTotalPrice();
    this.toggleAddItemPopup();
  };

  refetchModalData = response => {
    this.setState({ ...this.state, data: response.data }, () => {
      this.sumProductTotalPrice();
    });
  };

  handleChange = (e, status) => {
    if (status === "code") {
      this.handleSearchChange(this.state.editedData.code);
    }
    this.setState({
      editedData: {
        ...this.state.editedData,
        [status]: e.target.value
      }
    });
  };

  handleSearchChange = value => {
    this.setState({ product: Number(value) }, () => {
      if (
        String(this.state.editedData.code).length < 1 ||
        String(this.state.editedData.code) === "0"
      ) {
        this.setState({ notFound: NaN });
      } else {
        this.props
          .getProductsByCode(this.state.editedData.code)
          .then(() => {
            this.setState({
              notFound: false,
              productData: this.props.productsList
            });
          })
          .catch(() => {
            this.setState({
              notFound: true,
              productData: {}
            });
          });
      }
    });
  };

  handleCodeInputClick = e => {
    this.setState(
      {
        editedData: {
          code: e.target.value
        }
      },
      () => {
        if (Number(this.state.editedData.code)) {
          this.props.getProductsByCode(this.state.editedData.code).then(() => {
            this.setState({
              notFound: false,
              productData: this.props.productsList
            });
          });
        }
      }
    );
  };

  itemsRender = (item, index) => {
    return (
      <Card.Group key={index} id="s-showInfromationModel">
        <Card fluid>
          <Card.Content>
            <Card.Header className="yekan">
              <React.Fragment>
                <span>
                  {this.state.notFound === false
                    ? this.state.productData.name
                    : item.product.name}
                </span>
                &nbsp;-&nbsp;
                <span>قیمت واحد</span>
                &nbsp;
                <span id="norm-latin">
                  {this.state.notFound === false
                    ? priceToPersian(this.state.productData.selling_price)
                    : priceToPersian(item.product.selling_price)}
                </span>
                &nbsp;
                <span>تومان</span>
              </React.Fragment>
              {!this.state.editMode ? (
                <React.Fragment>
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
                </React.Fragment>
              ) : null}
            </Card.Header>
          </Card.Content>
          <Card.Content>
            <Form>
              <Form.Group widths="equal">
                <Popup
                  content={
                    <React.Fragment>
                      {this.state.notFound === false ? (
                        <Label color="teal" className="rtl text-center">
                          <p>
                            <span>نام محصول:</span>&nbsp;
                            <span>{this.state.productData.name}</span>
                          </p>
                          <p>
                            <span>مقدار باقی مانده:</span>&nbsp;
                            <span>
                              {enToFa(this.state.productData.stock_amount)}
                            </span>
                            &nbsp;
                            <span>متر</span>
                          </p>
                          <p>
                            <span>قیمت هر متر:</span>&nbsp;
                            <span>
                              {enToFa(
                                priceToPersian(
                                  this.state.productData.selling_price
                                )
                              )}
                            </span>
                            &nbsp;
                            <span>تومان</span>
                          </p>
                        </Label>
                      ) : (
                        <Label color="red">
                          <Icon name="warning circle" />
                          <span>محصول مورد نظر یافت نشد</span>
                        </Label>
                      )}
                    </React.Fragment>
                  }
                  position="bottom center"
                  on="focus"
                  trigger={
                    <Form.Input
                      fluid
                      readOnly={this.state.editting !== index ? true : false}
                      type="number"
                      className="rtl placeholder-rtl text-right"
                      defaultValue={item.product.code}
                      onChange={e => this.handleChange(e, "code")}
                      onClick={e => this.handleCodeInputClick(e)}
                      label="کد محصول"
                    />
                  }
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
                  <Button
                    color="green"
                    onClick={() => this.submitChanges(item.pk)}
                  >
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

  labelRender = () => {
    if (this.state.labelEdit) {
      return (
        <span
          className="d-flex"
          style={{
            marginBottom: "2px",
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          <Label
            onClick={() => this.applyEdit()}
            className="pointer"
            style={{ marginRight: 5 }}
            size="mini"
            color="green"
          >
            <Icon name="checkmark" /> اعمال
          </Label>
          <span style={{ fontSize: "13px", fontWeight: 700 }}>تخفیف کلی</span>
        </span>
      );
    } else {
      return (
        <span
          className="d-flex"
          style={{
            marginBottom: "2px",
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          <Label
            onClick={() => this.switchToEditMode()}
            className="pointer"
            style={{ marginRight: 5 }}
            size="mini"
            color="teal"
          >
            <Icon name="edit" /> ویرایش
          </Label>
          <span style={{ fontSize: "13px", fontWeight: 700 }}>تخفیف کلی</span>
        </span>
      );
    }
  };

  render() {
    return (
      <Modal
        id="add-bill"
        closeOnDimmerClick={false}
        dimmer="blurring"
        className="text-right rtl yekan"
        open={this.props.open}
        onClose={this.props.onClose}
      >
        {this.props.data ? (
          <React.Fragment>
            <Modal.Header className="yekan">فاکتور</Modal.Header>
            <Modal.Content scrolling>
              <Form>
                <Form.Group unstackable widths={4}>
                  <Form.Input
                    className="ltr placeholder-rtl"
                    readOnly
                    defaultValue={this.props.data.buyer.phone_number}
                    label="شماره تلفن همراه"
                    type="number"
                    placeholder="شماره تلفن همراه"
                  />
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
                    className="ltr"
                    readOnly={!this.state.labelEdit}
                    defaultValue={
                      this.state.discount_s ? "" : this.state.discount
                    }
                    label={() => this.labelRender()}
                    type="number"
                    onChange={e => this.handleDiscountChange(e)}
                    placeholder={
                      this.props.data.total_discount -
                      this.props.data.items_discount
                    }
                    max={this.state.sumProductTotalPrice - this.state.discount}
                  />
                  <Form.Input
                    readOnly
                    className="rtl placeholder-rtl text-right"
                    label="قیمت نهایی فاکتور"
                    value={`${digitToComma(
                      Math.round(
                        this.state.sumProductTotalPrice - this.state.discount
                      )
                    )} تومان`}
                  />
                </Form.Group>
                {!this.props.data.items.length && (
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
                    content={
                      <NewBillPopup
                        onClose={this.toggleAddItemPopup}
                        phoneNumber={this.props.data.buyer.phone_number}
                        refetch={this.refetchModalData}
                        pk={this.props.data.pk}
                        onSubmit={this.submitItemPopup}
                      />
                    }
                    open={this.state.isOpenAddItem}
                    position="center"
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
                  hidden={!this.props.data.items.length}
                  style={{ paddingTop: 0 }}
                >
                  <Header as="h3" floated="right">
                    <span>اقلام فاکتور</span>
                    &nbsp;
                    <Label
                      className="norm-latin"
                      style={{ margin: "13px 5px 0 0" }}
                    >
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
                  {this.props.data.items.map((item, index) => {
                    return this.itemsRender(item, index);
                  })}
                </Segment>
              </Form>
            </Modal.Content>

            <Modal.Actions>
              <Button
                color="black"
                onClick={() => {
                  this.props.onClose();
                }}
                disabled={this.state.editMode ? true : false}
              >
                <span>بستن</span>
              </Button>
            </Modal.Actions>
          </React.Fragment>
        ) : (
          <LoadingBar />
        )}
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    productsList: state.depository.productsList,
    data: state.sale.theBill
  };
};

export default connect(mapStateToProps, {
  deleteItem,
  getCustomerByPhoneNumber,
  updateBill,
  updateBillItem,
  getProductsByCode,
  getOneBill
})(InformationModal);
