import React from "react";
import {
  Container,
  Segment,
  Grid,
  Table,
  Button,
  Checkbox,
  Modal,
  Header
} from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getOneBill,
  deletePayment,
  doneTheBill
} from "../../actions/CashRegisterActions";
import LoadingBar from "../utils/loadingBar";
import AddPaymentModal from "./AddPaymentModal";
import { digitToComma } from "../utils/numberUtils";
import EditCustomerModal from "./EditCustomerModal";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import logo from "../../assets/logo_printable.png";
import { toastr } from "react-redux-toastr";
import history from "../../history";

class ViewBillModal extends React.Component {
  state = {
    fetch: false,
    openAddPayment: false,
    openEditCustomer: false,
    anyPays: false,
    open: false
  };

  componentDidMount() {
    this.getBill();
  }

  getBill = () => {
    this.props.getOneBill(this.props.match.params.pk).then(() => {
      this.setState({
        fetch: true,
        anyPays: this.props.theBill.payments.length ? true : false
      });
    });
  };

  toggleAddPaymentModal = () => {
    this.setState({
      openAddPayment: !this.state.openAddPayment
    });
  };

  toggleEditCustomerModal = () => {
    this.setState({
      openEditCustomer: !this.state.openEditCustomer
    });
  };

  deletePayment = pk => {
    let confirm = window.confirm("آیا از حذف این پرداخت مطمئن هستید؟");
    if (confirm) {
      this.props
        .deletePayment(pk)
        .then(() => {
          this.getBill();
          toastr.success("پرداخت با موفقیت حذف شد");
        })
        .catch(() => {
          toastr.error("خطا در حذف پرداختی");
        });
    }
  };

  closeModal = () => this.setState({ open: false });

  handleSubmit = pk => {
    this.props.doneTheBill(pk).then(() => {
      history.push(`/factor/${pk}/print`);
    });
  };

  render() {
    const bill = this.props.theBill;
    return (
      <Container>
        {this.state.fetch ? (
          <Segment.Group className="rtl" style={{ padding: "10px" }}>
            <Grid>
              <Grid.Column floated="right" width={14}>
                <Segment.Group horizontal>
                  <Table className="text-right">
                    <Table.Body>
                      <Table.Row colSpan={3}>
                        <Table.Cell>
                          <span style={{ fontWeight: "bold" }}>
                            شماره فاکتور:
                          </span>
                          &nbsp;
                          <span id="norm-latin">{bill.pk}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <span style={{ fontWeight: "bold" }}>فروشنده:</span>
                          &nbsp;
                          <span>
                            {bill.seller.first_name}&nbsp;
                            {bill.seller.last_name}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span style={{ fontWeight: "bold" }}>صندوق دار:</span>
                          &nbsp;
                          <span>
                            {window.localStorage.user.first_name}&nbsp;
                            {window.localStorage.user.last_name}
                          </span>
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row>
                        <Table.Cell>
                          <span style={{ fontWeight: "bold" }}>نام مشتری:</span>
                          &nbsp;
                          <span>
                            {bill.buyer.first_name}&nbsp;
                            {bill.buyer.last_name}
                          </span>
                          <Button
                            circular
                            className="yekan"
                            color="teal"
                            onClick={() => {
                              this.toggleEditCustomerModal();
                            }}
                          >
                            ویرایش
                          </Button>
                        </Table.Cell>
                        <Table.Cell>
                          <span style={{ fontWeight: "bold" }}>امتیاز:</span>
                          &nbsp;
                          <span id="norm-latin">{bill.buyer.points}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <span style={{ fontWeight: "bold" }}>
                            شماره همراه:
                          </span>
                          &nbsp;
                          <span id="norm-latin">{bill.buyer.phone_number}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <span style={{ fontWeight: "bold" }}>نوع:</span>
                          &nbsp;
                          <span>{bill.items[0].product.f_type.name}</span>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Segment.Group>
              </Grid.Column>
              <Grid.Column
                floated="left"
                className={"only-desktop"}
                // mobile={16}
                width={2}
                style={{ paddingRight: 0 }}
              >
                <img src={logo} className="nafis-logo" />
              </Grid.Column>
            </Grid>
            <Table celled className="rtl text-center">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="table-border-left">
                    ردیف
                  </Table.HeaderCell>
                  <Table.HeaderCell>شرح کالا</Table.HeaderCell>
                  <Table.HeaderCell>کد کالا</Table.HeaderCell>
                  <Table.HeaderCell>متراژ</Table.HeaderCell>
                  <Table.HeaderCell>مبلغ واحد</Table.HeaderCell>
                  <Table.HeaderCell>تخفیف</Table.HeaderCell>
                  <Table.HeaderCell>مبلغ خام</Table.HeaderCell>
                  <Table.HeaderCell>مبلغ نهایی</Table.HeaderCell>
                  <Table.HeaderCell className="table-border-left-none">
                    ته طاقه
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {bill.items.map((item, index) => {
                  return (
                    <Table.Row>
                      <Table.Cell className="table-border-left" id="norm-latin">
                        {index + 1}
                      </Table.Cell>
                      <Table.Cell>{item.product.name}</Table.Cell>
                      <Table.Cell id="norm-latin">
                        {item.product.code}
                      </Table.Cell>
                      <Table.Cell id="norm-latin">{item.amount}</Table.Cell>
                      <Table.Cell id="norm-latin">
                        {digitToComma(item.product.selling_price)}
                      </Table.Cell>
                      <Table.Cell id="norm-latin">
                        {digitToComma(item.discount)}
                      </Table.Cell>
                      <Table.Cell id="norm-latin">
                        {digitToComma(item.price)}
                      </Table.Cell>
                      <Table.Cell id="norm-latin">
                        {digitToComma(item.final_price)}
                      </Table.Cell>
                      <Table.Cell className="table-border-left-none">
                        <Checkbox toggle readOnly checked={item.end_of_roll} />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
            <Table celled className="rtl text-center" columns="4">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="table-border-left">
                    مبلغ خام
                  </Table.HeaderCell>
                  <Table.HeaderCell>مچموع تخفیف کالایی</Table.HeaderCell>
                  <Table.HeaderCell>تخفیف روی کل فاکتور</Table.HeaderCell>
                  <Table.HeaderCell className="table-border-left-none">
                    مبلغ قابل پرداخت
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell className="table-border-left" id="norm-latin">
                    {digitToComma(bill.final_price)}
                  </Table.Cell>
                  <Table.Cell id="norm-latin">
                    {digitToComma(bill.total_discount)}
                  </Table.Cell>
                  <Table.Cell id="norm-latin">
                    {digitToComma(bill.items_discount)}
                  </Table.Cell>
                  <Table.Cell
                    className="table-border-left-none"
                    id="norm-latin"
                  >
                    {digitToComma(bill.remaining_payment)}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <hr color="#ddd" />

            {this.state.anyPays && (
              <Table celled className="rtl text-center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan="4" className="text-right">
                      پرداخت ها
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell className="table-border-left">
                      تاریخ ایجاد
                    </Table.HeaderCell>
                    <Table.HeaderCell>مبلغ پرداختی</Table.HeaderCell>
                    <Table.HeaderCell>نوع پرداخت</Table.HeaderCell>
                    <Table.HeaderCell className="table-border-left-none">
                      عملیات
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {bill.payments.map(payment => {
                    return (
                      <Table.Row>
                        <Table.Cell
                          className="table-border-left"
                          id="norm-latin"
                        >
                          {standardTimeToJalaali(payment.create_date)}
                        </Table.Cell>
                        <Table.Cell id="norm-latin">
                          {digitToComma(payment.amount)}
                        </Table.Cell>
                        <Table.Cell>
                          {payment.type === "card" ? "نقد و کارت" : "چک"}
                        </Table.Cell>
                        <Table.Cell className="table-border-left-none">
                          <Button
                            color="red"
                            className="yekan"
                            onClick={() => this.deletePayment(payment.pk)}
                          >
                            حذف
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            )}
            <div className="text-center padded">
              <Button
                circular
                onClick={() => {
                  this.setState({ open: true });
                }}
                size="huge"
                color="green"
                icon="check"
                disabled={!bill.payments.length}
              />
              <Button
                circular
                onClick={() => {
                  this.toggleAddPaymentModal();
                }}
                color="teal"
                size="huge"
                icon="add"
              />
              <Button
                circular
                onClick={() => window.history.back()}
                size="huge"
                icon="arrow left"
              />
            </div>

            <Modal
              dimmer={"blurring"}
              open={this.state.open}
              onClose={this.closeModal}
            >
              <Modal.Header className="yekan text-right">
                بستن فاکتور
              </Modal.Header>
              <Modal.Content>
                <Header className="yekan text-right">
                  آیا از بستن این فاکتور اطمینان دارید؟
                </Header>
              </Modal.Content>
              <Modal.Actions>
                <Button
                  color="black"
                  onClick={this.closeModal}
                  className="yekan"
                >
                  انصراف
                </Button>
                <Button
                  positive
                  icon="checkmark"
                  labelPosition="right"
                  content="بستن فاکتور"
                  onClick={() => this.handleSubmit(bill.pk)}
                  className="yekan"
                />
              </Modal.Actions>
            </Modal>

            {this.state.openAddPayment && (
              <AddPaymentModal
                open={this.state.openAddPayment}
                onClose={this.toggleAddPaymentModal}
                price={bill.final_price}
                pk={bill.pk}
                refetch={this.getBill}
              />
            )}
            {this.state.openEditCustomer && (
              <EditCustomerModal
                open={this.state.openEditCustomer}
                onClose={this.toggleEditCustomerModal}
                pk={bill.buyer.pk}
                madeChange={this.getBill}
              />
            )}
          </Segment.Group>
        ) : (
          <LoadingBar />
        )}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  console.log("state sale", state.sale);
  return {
    theBill: state.cash.theBill
  };
};

export default connect(mapStateToProps, {
  getOneBill,
  deletePayment,
  doneTheBill
})(ViewBillModal);
