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
          <Grid.Column floated="right">
            <h2 className="yekan">صندوق</h2>
          </Grid.Column>
          <Grid.Column floated="left">
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
                <Grid.Column width={5} floated="right">
                  <h3 className="yekan">لیست فاکتورهای فعال</h3>
                </Grid.Column>
                <Grid.Column width={4} floated="left">
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
                  <TableLabel>1</TableLabel>
                  موبایل خریدار
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>2</TableLabel>
                  اسم فروشنده
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>3</TableLabel>
                  مبلغ نهایی فاکتور
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>4</TableLabel>
                  تاریخ فاکتور
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
                      <TableLabel>1</TableLabel>
                      {bill.buyer.phone_number}
                    </Table.Cell>
                    <Table.Cell>
                      <TableLabel>2</TableLabel>
                      {bill.seller.first_name} {bill.seller.last_name}
                    </Table.Cell>
                    <Table.Cell
                      style={{ fontFamily: "arial", fontWeight: "bold" }}
                    >
                      <TableLabel>3</TableLabel>
                      {digitToComma(bill.final_price)}&nbsp;
                      <span className="yekan">تومان</span>
                    </Table.Cell>
                    <Table.Cell style={{ fontFamily: "arial" }}>
                      <TableLabel>4</TableLabel>
                      {standardTimeToJalaali(
                        convertToJalaali(bill.create_date)
                      )}
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
