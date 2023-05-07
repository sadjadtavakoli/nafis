import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  Button,
  Icon,
  Container,
  Segment,
  Grid
} from "semantic-ui-react";
import { getDailyReport } from "../../actions/CashRegisterActions";
import { priceToPersian } from "../utils/numberUtils";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import TableLabel from "../utils/tableLabelGenerator";
import NotFound from "../utils/notFound";
import LoadingBar from "../utils/loadingBar";
import "../../scss/bootstrap.scss";

const DailyReport = () => {
  const [fetch, setFetch] = useState(false);

  const report = useSelector(state => state.cash.dailyReport);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDailyReport()).then(() => {
      setFetch(true);
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

      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-right" colSpan="12">
              گزارش روزانه
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {fetch && report.total_items ? (
          <React.Fragment>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={12}>تعداد کل فاکتور ها</TableLabel>
                </Table.HeaderCell>
                {window.localStorage.type === "admin" ? (
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={11}> سود کل</TableLabel>
                  </Table.HeaderCell>
                ) : null}
                <Table.HeaderCell className="text-center">
                  <TableLabel count={10}> فاکتورهای مانده‌حساب</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={9}> مانده‌ حساب</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={8}> کل پرداخت</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={7}> پرداخت‌های کارت</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={6}> پرداخت‌های نقد</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={5}> پرداخت‌های چک</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={4}> کل تخفیف داده‌شده</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={3}> مبلغ خالص فروش</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={2}> مبلغ خام فروش</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={1}> تعداد اقلام</TableLabel>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel count={12}>
                    <span>{priceToPersian(report.bills_data.length)}</span>
                  </TableLabel>
                </Table.Cell>
                {window.localStorage.type === "admin" ? (
                  <Table.Cell className="text-center norm-latin" collapsing>
                    <TableLabel count={11}>
                      <span>{priceToPersian(report.total_profit)}</span>
                    </TableLabel>
                  </Table.Cell>
                ) : null}
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel count={10}>
                    <span>
                      {priceToPersian(report.bills_with_reminded_status)}
                    </span>
                  </TableLabel>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel count={9}>
                    <span>
                      {priceToPersian(report.total_reminded_payments)}
                    </span>
                  </TableLabel>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel count={8}>
                    <span>{priceToPersian(report.total_paid)}</span>
                  </TableLabel>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel count={7}>
                    <span>{priceToPersian(report.total_card_paid)}</span>
                  </TableLabel>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel count={6}>
                    <span>{priceToPersian(report.total_cash_paid)}</span>
                  </TableLabel>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel count={5}>
                    <span>{priceToPersian(report.total_cheque_paid)}</span>
                  </TableLabel>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel count={44}>
                    <span>{priceToPersian(report.total_discount)}</span>
                  </TableLabel>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel count={3}>
                    <span>{priceToPersian(report.total_final_price)}</span>
                  </TableLabel>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel count={2}>
                    <span>{priceToPersian(report.total_price)}</span>
                  </TableLabel>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel count={1}>
                    <span>{priceToPersian(report.total_items)}</span>
                  </TableLabel>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </React.Fragment>
        ) : null}
      </Table>
      {!fetch ? <LoadingBar /> : null}
      {fetch && !report.total_items ? <NotFound /> : null}

      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-right" colSpan="12">
              فاکتور های بسته شده
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {fetch && report.bills_data.length ? (
          <React.Fragment>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="text-center">
                  عملیات
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={10}> قیمت کل</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={9}> قیمت خام بدون تخفیف</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={8}> تخفیف کل</TableLabel>
                </Table.HeaderCell>
                {window.localStorage.type === "admin" ? (
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={7}> سود</TableLabel>
                  </Table.HeaderCell>
                ) : null}
                <Table.HeaderCell className="text-center">
                  <TableLabel count={6}> تعداد اقلام</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={5}> تاریخ بسته شدن</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={4}> شماره تلفن خریدار</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={3}> شعبه</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={2}> نام فروشنده</TableLabel>
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel count={1}> شماره فاکتور</TableLabel>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {fetch && report.bills_data.length
                ? report.bills_data.map(item => {
                    return (
                      <Table.Row>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <Button
                            as="a"
                            href={`/factor/${item.pk}/print`}
                            target="_blank"
                            icon
                            labelPosition="right"
                            color="yellow"
                          >
                            <span className="yekan">چاپ فاکتور</span>
                            <Icon name="print" />
                          </Button>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel count={10}>
                            <span>{priceToPersian(item.final_price)}</span>
                          </TableLabel>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel count={9}>
                            <span>{priceToPersian(item.price)}</span>
                          </TableLabel>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel count={8}>
                            <span>{priceToPersian(item.total_discount)}</span>
                          </TableLabel>
                        </Table.Cell>
                        {window.localStorage.type === "admin" ? (
                          <Table.Cell
                            className="text-center norm-latin"
                            collapsing
                          >
                            <TableLabel count={7}>
                              <span>{priceToPersian(item.profit)}</span>
                            </TableLabel>
                          </Table.Cell>
                        ) : null}
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel count={6}>
                            <span>{item.items_count}</span>
                          </TableLabel>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel count={5}>
                            <span>
                              {standardTimeToJalaali(item.close_date)}
                            </span>
                          </TableLabel>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel count={4}>
                            <span>{item.buyer.phone_number}</span>
                          </TableLabel>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel count={3}>
                            <span>{item.branch && item.branch.name}</span>
                          </TableLabel>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel count={2}>
                            <span>{item.seller.username}</span>
                          </TableLabel>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel count={1}>
                            <span>{item.bill_code}</span>
                          </TableLabel>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                : null}
            </Table.Body>
          </React.Fragment>
        ) : null}
        {!fetch ? <LoadingBar /> : null}
        {fetch && !report.bills_data.length ? <NotFound /> : null}
      </Table>
    </Container>
  );
};

export default DailyReport;
