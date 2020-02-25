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
  Divider,
  Header,
  Segment,
  Form,
  Popup,
  Icon,
  Message,
  Label,
  Container
} from "semantic-ui-react";
import { getProductsByCode } from "../../actions/DepositoryActions";
import NewBillPopup from "./newBillPopup";
import { toastr } from "react-redux-toastr";
import LoadingBar from "../utils/loadingBar";
import ItemsRender from "./renderItem";

class InformationPage extends React.Component {
  state = {
    branchOptions: [{ key: "1", value: "1", flag: "ir", text: "شعبه یک" }],
    sumProductTotalPrice: 0,
    isOpenAddItem: false,
    labelEdit: false,
    notFound: null,
    discount: null,
    discount_s: false,
    editting: "",
    editedData: {},
    width: window.innerWidth
  };

  componentDidMount() {
    this.getOneBill();
  }

  getOneBill = () => {
    this.props.getOneBill(this.props.match.params.pk).then(() => {
      this.sumProductTotalPrice();
      this.initialize();
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

  initialize = () => {
    this.setState({
      discount: this.props.data.total_discount - this.props.data.items_discount
    });
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
          this.getOneBill();
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

  submitChanges = (pk, end_of_roll) => {
    let preparedData = {
      code: this.state.editedData.code,
      amount: this.state.editedData.amount,
      discount: this.state.editedData.discount,
      end_of_roll: end_of_roll,
      end_of_roll_amount: this.state.editedData.end_of_roll_amount
    };
    if (this.state.end_of_roll) {
      if (!preparedData.end_of_roll_amount) {
        window.alert("مقدار حساب شده صحیح نیست");
      }
    }
    this.props.updateBillItem(pk, preparedData).then(() => {
      this.setState({
        editting: "",
        editMode: false
      });
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
    if (status === "end_of_roll") {
      this.setState({
        end_of_roll: true
      });
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
      <Container>
        <Segment stacked className="rtl">
          <h3 className="yekan">
            مشاهده و ویرایش فاکتور
            <Button
              circular
              onClick={() => window.history.back()}
              icon="arrow left"
              style={{ float: "left" }}
            />
          </h3>
        </Segment>
        {this.props.data ? (
          <Segment className="rtl text-right">
            <Form>
              <Form.Group unstackable widths={this.state.width < 425 ? 1 : 4}>
                <Form.Input
                  className={`ltr placeholder-rtl`}
                  readOnly
                  defaultValue={this.props.data.buyer.phone_number}
                  label="شماره تلفن همراه"
                  type="number"
                  placeholder="شماره تلفن همراه"
                />
                <Form.Dropdown
                  className={`ltr placeholder-rtl text-right`}
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
                      pk={this.props.data.pk}
                      onSubmit={this.submitItemPopup}
                      getOneBill={this.getOneBill}
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
                      style={
                        this.state.width < 425
                          ? { marginTop: "10px" }
                          : { marginBottom: "10px" }
                      }
                    />
                  }
                />
              </div>
              <Segment
                hidden={!this.props.data.items.length}
                style={{ paddingTop: 0 }}
                style={{ marginTop: "10px" }}
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
                {this.props.data.items.map((item, index) => (
                  <ItemsRender
                    item={item}
                    index={index}
                    editting={this.state.editting}
                    productData={this.state.productData}
                    notFound={this.state.notFound}
                    editMode={this.state.editMode}
                    width={this.state.width}
                    handleChange={this.handleChange}
                    handleCodeInputClick={this.handleCodeInputClick}
                    cancelChanges={this.cancelChanges}
                    deleteItem={this.deleteItem}
                    editItem={this.editItem}
                    submitChanges={this.submitChanges}
                  />
                ))}
              </Segment>
            </Form>
          </Segment>
        ) : (
          <LoadingBar />
        )}
      </Container>
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
})(InformationPage);
