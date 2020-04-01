import React, { useState, useEffect } from "react";
import { Container, Segment, Button, Table, Grid } from "semantic-ui-react";
import history from "../../history";
import { getActiveBills, deleteBill } from "../../actions/CashRegisterActions";
import { digitToComma } from "../utils/numberUtils";
import { standardTimeToJalaali, convertToJalaali } from "../utils/jalaaliUtils";
import NotFound from "../utils/notFound";
import LoadingBar from "../utils/loadingBar";
import { toastr } from "react-redux-toastr";
import TableLabel from "../utils/tableLabelGenerator";
import { useSelector, useDispatch } from "react-redux";
import RepeatButton from "../utils/RepeatButton";

const Cashregister = () => {
  const [fetch, setFetch] = useState(false);

  const bills = useSelector(state => state.cash.activeBills);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getActiveBills()).then(() => {
      setFetch(true);
      console.log(bills);
    });
  }, [fetch]);

  return (
    <Container>
      <Segment stacked className="rtl">
        <Grid verticalAlign="middle">
          <Grid.Column floated="right" computer={5} mobile={5}>
            <h2 className="yekan">صندوق</h2>
          </Grid.Column>
          <Grid.Column floated="left" computer={1} mobile={4}>
            <Button
              circular
              icon="left arrow"
              onClick={() => window.history.back()}
            />
          </Grid.Column>
        </Grid>
      </Segment>

      <Table celled className="rtl text-center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-right" colSpan="5">
              <Grid verticalAlign="middle">
                <Grid.Column computer={3} mobile={16}>
                  <h3 className="yekan">لیست فاکتورهای فعال</h3>
                </Grid.Column>
                <Grid.Column computer={3} mobile={16}>
                  <RepeatButton onClick={() => dispatch(getActiveBills())} />
                </Grid.Column>
                <Grid.Column computer={4} mobile={16} floated="left">
                  <Button
                    onClick={() => history.push("/daily-report/")}
                    color="teal"
                    content="مشاهده گزارش روزانه"
                    icon="print"
                    labelPosition="right"
                    className="yekan"
                  />
                </Grid.Column>
              </Grid>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {fetch && bills.count ? (
          <React.Fragment>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="table-border-left">
                  <TableLabel count={1}>موبایل خریدار</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel count={2}>اسم فروشنده</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel count={3}>مبلغ نهایی فاکتور</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel count={4}>تاریخ فاکتور</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell>عملیات فاکتور</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {bills.results.map(bill => {
                return (
                  <Table.Row>
                    <Table.Cell
                      className="table-border-left"
                      style={{ fontFamily: "arial" }}
                    >
                      <TableLabel count={1}>
                        {bill.buyer.phone_number}
                      </TableLabel>
                    </Table.Cell>
                    <Table.Cell>
                      <TableLabel count={2}>
                        {bill.seller.first_name} {bill.seller.last_name}
                      </TableLabel>
                    </Table.Cell>
                    <Table.Cell
                      style={{ fontFamily: "arial", fontWeight: "bold" }}
                    >
                      <TableLabel count={3}>
                        <span className="yekan">تومان</span>
                        {digitToComma(bill.final_price)}&nbsp;
                      </TableLabel>
                    </Table.Cell>
                    <Table.Cell style={{ fontFamily: "arial" }}>
                      <TableLabel count={4}>
                        {convertToJalaali(bill.create_date)}
                      </TableLabel>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        icon="info"
                        labelPosition="right"
                        color="teal"
                        content="مشاهده"
                        className="yekan"
                        size="mini"
                        onClick={() => {
                          history.push(`/cashregister/${bill.pk}`);
                        }}
                      />
                      <Button
                        icon="trash"
                        labelPosition="right"
                        color="red"
                        content="حذف"
                        className="yekan"
                        size="mini"
                        onClick={() => {
                          deleteBill(bill.pk)
                            .then(() => {
                              toastr.success(
                                "حذف فاکتور با موفقیت انجام شد",
                                "فاکتور با موفقیت حذف گردید"
                              );
                              this.props.getActiveBills();
                            })
                            .catch(() => {
                              toastr.error("عملیات حذف ناموفق بود");
                            });
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </React.Fragment>
        ) : null}
      </Table>
      {!fetch ? <LoadingBar /> : null}
      {fetch && !bills.count ? <NotFound /> : null}
    </Container>
  );
};

export default Cashregister;
