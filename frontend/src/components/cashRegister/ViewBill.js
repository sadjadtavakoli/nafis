import React from "react";
import {
  Container,
  Segment,
  Grid,
  Table,
  Button,
  Checkbox,
  Modal,
  Header,
  Input,
  Label
} from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getOneBill,
  deletePayment,
  doneTheBill
} from "../../actions/CashRegisterActions";
import LoadingBar from "../utils/loadingBar";
import TableLabel from "../utils/tableLabelGenerator";
import AddPaymentModal from "./AddPaymentModal";
import { digitToComma } from "../utils/numberUtils";
import EditCustomerModal from "./EditCustomerModal";
import { standardTimeToJalaali, convertToJalaali } from "../utils/jalaaliUtils";
import logo from "../../assets/logo_printable.png";
import { toastr } from "react-redux-toastr";
import history from "../../history";
import { updateBill } from "../../actions/SaleActions";

class ViewBillModal extends React.Component {
  state = {
    fetch: false,
    openAddPayment: false,
    openEditCustomer: false,
    anyPays: false,
    open: false,
    editPoints: false,
    points: 0,
    toggle: false
  };

  componentDidMount() {
    this.getBill();
  }

  getBill = () => {
    this.props.getOneBill(this.props.match.params.pk).then(() => {
      this.setState({
        fetch: true,
        anyPays: this.props.theBill.payments.length ? true : false,
        points: this.props.theBill.buyer.points
      });
    });
  };

  toggleAddPaymentModal = () => {
    this.setState({
      openAddPayment: !this.state.openAddPayment
    });
  };

  toggleEditCustomerModal = () => {
    this.setState(
      {
        openEditCustomer: !this.state.openEditCustomer
      },
      () => {
        this.getBill();
      }
    );
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
    let sms = this.state.toggle;
    this.props.doneTheBill(pk, sms).then(() => {
      history.push(`/factor/${pk}/print`);
    });
  };

  handlePointsChange = e => {
    this.setState({
      points: e.target.value
    });
  };

  handleEditClick = () => {
    this.setState({
      editPoints: true
    });
  };

  handleEditSubmit = pk => {
    this.props
      .updateBill(pk, { used_points: Number(this.state.points) })
      .then(() => {
        this.setState({
          editPoints: false
        });
      });
  };

  handleToggleChange = () => {
    this.setState({
      toggle: !this.state.toggle
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
                          <span>{bill.buyer.class_type}</span>
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
                    <TableLabel>1</TableLabel>
                    ردیف
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel>2</TableLabel>
                    شرح کالا
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel>3</TableLabel>
                    کد کالا
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel>4</TableLabel>
                    متراژ
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel>5</TableLabel>
                    مبلغ واحد
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel>6</TableLabel>
                    تخفیف
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel>7</TableLabel>
                    مبلغ خام
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel>8</TableLabel>
                    مبلغ نهایی
                  </Table.HeaderCell>
                  <Table.HeaderCell className="table-border-left-none">
                    <TableLabel>9</TableLabel>
                    ته طاقه
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {bill.items.map((item, index) => {
                  return (
                    <Table.Row>
                      <Table.Cell className="table-border-left" id="norm-latin">
                        <TableLabel>1</TableLabel>
                        {index + 1}
                      </Table.Cell>
                      <Table.Cell>
                        <TableLabel>2</TableLabel>
                        {item.product.name}
                      </Table.Cell>
                      <Table.Cell id="norm-latin">
                        <TableLabel>3</TableLabel>
                        {item.product.code}
                      </Table.Cell>
                      <Table.Cell id="norm-latin">
                        <TableLabel>4</TableLabel>
                        {item.amount}
                      </Table.Cell>
                      <Table.Cell id="norm-latin">
                        <TableLabel>5</TableLabel>
                        {digitToComma(item.product.selling_price)}
                      </Table.Cell>
                      <Table.Cell id="norm-latin">
                        <TableLabel>6</TableLabel>
                        {digitToComma(item.discount)}
                      </Table.Cell>
                      <Table.Cell id="norm-latin">
                        <TableLabel>7</TableLabel>
                        {digitToComma(item.price)}
                      </Table.Cell>
                      <Table.Cell id="norm-latin">
                        <TableLabel>8</TableLabel>
                        {digitToComma(item.final_price)}
                      </Table.Cell>
                      <Table.Cell className="table-border-left-none">
                        <TableLabel>9</TableLabel>
                        <Checkbox toggle readOnly checked={item.end_of_roll} />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
            <Grid reversed celled className={"ltr"}>
              <Grid.Row>
                <Grid.Column className={"norm-latin text-right"} width={13}>
                  <span>{digitToComma(bill.final_price)}</span>
                </Grid.Column>
                <Grid.Column width={3} className={"bg-table"}>
                  مبلغ خام
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column className={"norm-latin text-right"} width={13}>
                  <span>{digitToComma(bill.total_discount)}</span>
                </Grid.Column>
                <Grid.Column width={3} className={"bg-table"}>
                  مجموع تخفیف کالایی
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column className={"norm-latin text-right"} width={13}>
                  <span>{digitToComma(bill.items_discount)}</span>
                </Grid.Column>
                <Grid.Column width={3} className={"bg-table"}>
                  تخفیف روی کل فاکتور
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column className={"norm-latin text-right"} width={13}>
                  <Input
                    value={this.state.points}
                    onChange={e => this.handlePointsChange(e)}
                    readOnly={this.state.editPoints ? false : true}
                    type="number"
                    className="ltr"
                  />
                </Grid.Column>
                <Grid.Column width={3} className={"bg-table"}>
                  <Label
                    color={this.state.editPoints ? "green" : "teal"}
                    style={{ marginRight: "5px" }}
                    className="pointer"
                    onClick={
                      !this.state.editPoints
                        ? this.handleEditClick
                        : () => this.handleEditSubmit(bill.pk)
                    }
                  >
                    {this.state.editPoints ? "اعمال" : "ویرایش"}
                  </Label>
                  <span>امتیاز</span>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column className={"norm-latin text-right"} width={13}>
                  <span>
                    {digitToComma(
                      Number(bill.remaining_payment) - Number(this.state.points)
                    )}
                  </span>
                </Grid.Column>
                <Grid.Column width={3} className={"bg-table"}>
                  مبلغ قابل پرداخت
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <hr color="#ddd" />

            {this.state.anyPays && (
              <Table celled className="rtl text-center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan="4" className="text-right">
                      <TableLabel>1</TableLabel>
                      پرداخت ها
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell className="table-border-left">
                      <TableLabel>2</TableLabel>
                      تاریخ ایجاد
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <TableLabel>3</TableLabel>
                      مبلغ پرداختی
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <TableLabel>4</TableLabel>
                      نوع پرداخت
                    </Table.HeaderCell>
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
                          <TableLabel>1</TableLabel>
                          {standardTimeToJalaali(payment.create_date)}
                        </Table.Cell>
                        <Table.Cell id="norm-latin">
                          <TableLabel>2</TableLabel>
                          {digitToComma(payment.amount)}
                        </Table.Cell>
                        <Table.Cell>
                          <TableLabel>3</TableLabel>
                          {payment.type === "card" ? "نقد و کارت" : "چک"}
                        </Table.Cell>
                        <Table.Cell className="table-border-left-none">
                          <Button
                            color="red"
                            className="yekan"
                            icon="trash"
                            labelPosition="right"
                            content={"حذف"}
                            onClick={() => this.deletePayment(payment.pk)}
                          />
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
                disabled={
                  Number(bill.remaining_payment) - Number(this.state.points) ===
                  0
                    ? true
                    : false
                }
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
              <Modal.Content className="rtl text-right">
                <Header className="yekan text-right">
                  آیا از بستن این فاکتور اطمینان دارید؟
                </Header>
                <div style={{ display: "inline-flex" }}>
                  <span className="rtl text-right" style={{ fontSize: "17px" }}>
                    ارسال
                  </span>
                  &nbsp;
                  <span id="norm-latin" style={{ fontSize: "17px" }}>
                    sms
                  </span>
                  &nbsp; &nbsp; &nbsp;
                  <Checkbox
                    className="text-right rtl"
                    toggle
                    onChange={this.handleToggleChange}
                  />
                </div>
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
                price={
                  Number(bill.remaining_payment) - Number(this.state.points)
                }
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
  console.log(state.cash.theBill);
  return {
    theBill: state.cash.theBill
  };
};

export default connect(mapStateToProps, {
  getOneBill,
  deletePayment,
  doneTheBill,
  updateBill
})(ViewBillModal);
