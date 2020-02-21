import React from "react";
import {
  Container,
  Segment,
  Grid,
  Table,
  Button,
  Card
} from "semantic-ui-react";
import { connect } from "react-redux";
import { getOneBill } from "../../actions/CashRegisterActions";
import LoadingBar from "../utils/loadingBar";

class ViewBillModal extends React.Component {
  state = {
    fetch: false
  };

  componentDidMount() {
    this.props.getOneBill(this.props.match.params.pk).then(() => {
      this.setState({ fetch: true });
      console.log("theBill", this.props.theBill);
    });
  }

  render() {
    const bill = this.props.theBill;
    return (
      <Container>
        <Segment.Group className="rtl" style={{ padding: "10px" }}>
          <Grid>
            <Grid.Column floated="right" width={13}>
              <Segment.Group horizontal>
                <Table className="text-right">
                  {this.state.fetch ? (
                    <Table.Body>
                      <Table.Row colSpan={3}>
                        <Table.Cell>
                          <span style={{ fontWeight: "bold" }}>
                            شماره فاکتور:
                          </span>
                          &nbsp;
                          <span style={{ fontFamily: "arial" }}>{bill.pk}</span>
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
                          <Button className="yekan" color="green">
                            ویرایش
                          </Button>
                        </Table.Cell>
                        <Table.Cell>
                          <span style={{ fontWeight: "bold" }}>امتیاز:</span>
                          &nbsp;
                          <span style={{ fontFamily: "arial" }}>
                            {bill.buyer.points}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span style={{ fontWeight: "bold" }}>
                            شماره همراه:
                          </span>
                          &nbsp;
                          <span style={{ fontFamily: "arial" }}>
                            {bill.buyer.phone_number}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span style={{ fontWeight: "bold" }}>نوع:</span>
                          &nbsp;
                          <span>{bill.items[0].product.f_type.name}</span>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ) : (
                    <LoadingBar />
                  )}
                </Table>
              </Segment.Group>
            </Grid.Column>
            <Grid.Column floated="left" width={3}>
              <Segment.Group horizontal>
                <Card>
                  <Card.Content description={"لوگو"} className="text-center" />
                </Card>
              </Segment.Group>
            </Grid.Column>
          </Grid>
          <Table celled className="rtl text-right">
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
              {this.state.fetch &&
                bill.items.map(item => {
                  return (
                    <Table.Row>
                      <Table.Cell className="table-border-left"></Table.Cell>
                      <Table.Cell>{item.product.name}</Table.Cell>
                      <Table.Cell>{item.product.code}</Table.Cell>
                      <Table.Cell>{item.amount}</Table.Cell>
                      <Table.Cell></Table.Cell>
                      <Table.Cell>{item.discount}</Table.Cell>
                      <Table.Cell>{item.price}</Table.Cell>
                      <Table.Cell>{item.final_price}</Table.Cell>
                      <Table.Cell className="table-border-left-none"></Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>
          <Table celled className="rtl text-right" columns="4">
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
              {this.state.fetch && (
                <Table.Row>
                  <Table.Cell className="table-border-left">
                    {bill.final_price}
                  </Table.Cell>
                  <Table.Cell>{bill.total_discount}</Table.Cell>
                  <Table.Cell>{bill.items_discount}</Table.Cell>
                  <Table.Cell className="table-border-left-none">
                    {bill.remaining_payment}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          <tr />
        </Segment.Group>
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
