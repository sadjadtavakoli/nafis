import React from "react";
import {
  Container,
  Segment,
  Grid,
  Table,
  Button,
  Card,
  Popup,
  Checkbox
} from "semantic-ui-react";
import { connect } from "react-redux";
import { getOneBill } from "../../actions/CashRegisterActions";
import LoadingBar from "../utils/loadingBar";
import AddPaymentPopup from "./AddPaymentPopup";
import { digitToComma, enToFa } from "../utils/numberUtils";
import history from "../../history";
import EditCustomerPopup from "./EditCustomerPopup";
import { getTodayJalaali } from "../utils/jalaaliUtils";

class ViewBillModal extends React.Component {
  state = {
    fetch: false,
    isOpenAddPayment: false,
    isOpenEditCustomer: false,
    anyPays: false,
    paidPrice: null,
    paymentType: null
  };

  componentDidMount() {
    this.getBill();
  }

  getBill = () => {
    this.props.getOneBill(this.props.match.params.pk).then(() => {
      this.setState({ fetch: true });
    });
  };

  toggleAddPaymentPopup = () => {
    this.setState(prevState => ({
      isOpenAddPayment: !prevState.isOpenAddPayment
    }));
  };

  toggleEditCustomerPopup = () => {
    this.setState(prevState => ({
      isOpenEditCustomer: !prevState.isOpenEditCustomer
    }));
  };

  submitPaymentPopup = (price, paymentType) => {
    this.setState({
      paidPrice: price,
      paymentType: paymentType,
      anyPays: true
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
                          <Popup
                            content={
                              <EditCustomerPopup
                                onClose={this.toggleEditCustomerPopup}
                                onSubmit={this.submitPaymentPopup}
                                pk={bill.buyer.pk}
                                madeChange={this.getBill}
                              />
                            }
                            open={this.state.isOpenEditCustomer}
                            position="bottom center"
                            wide="very"
                            trigger={
                              <Button
                                circular
                                className="yekan"
                                color="teal"
                                onClick={() => {
                                  this.toggleEditCustomerPopup(
                                    this.state.isOpenEditCustomer
                                  );
                                }}
                              >
                                ویرایش
                              </Button>
                            }
                          />
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
              <Grid.Column floated="left" width={2}>
                <Segment.Group horizontal>
                  <Card>
                    <Card.Content
                      className="text-center"
                      style={{ height: "100px" }}
                    >
                      <span
                        style={{
                          margin: "0",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)"
                        }}
                      >
                        لوگو
                      </span>
                    </Card.Content>
                  </Card>
                </Segment.Group>
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
            {this.state.anyPays && (
              <Table celled className="rtl text-center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan="3" className="text-right">
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
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="table-border-left yekan">
                      {enToFa(getTodayJalaali())}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      {this.state.paidPrice}
                    </Table.Cell>
                    <Table.Cell>{this.state.paymentType}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            )}
            <hr color="#ddd" />
            <div className="text-center padded">
              <Button
                circular
                onClick={() => {
                  history.push("/cashregister/");
                }}
                size="huge"
                color="green"
                icon="check"
                disabled
              />
              <Popup
                content={
                  <AddPaymentPopup
                    onClose={this.toggleAddPaymentPopup}
                    onSubmit={this.submitPaymentPopup}
                    price={bill.final_price}
                  />
                }
                open={this.state.isOpenAddPayment}
                className="no-filter"
                position="bottom center"
                wide="very"
                trigger={
                  <Button
                    circular
                    onClick={() => {
                      this.toggleAddPaymentPopup(this.state.isOpenAddPayment);
                    }}
                    color="teal"
                    size="huge"
                    icon="add"
                  />
                }
              />
              <Button
                circular
                onClick={() => {
                  history.push("/cashregister/");
                }}
                size="huge"
                icon="step backward"
              />
            </div>
          </Segment.Group>
        ) : (
          <LoadingBar />
        )}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    theBill: state.cash.theBill
  };
};

export default connect(mapStateToProps, { getOneBill })(ViewBillModal);
