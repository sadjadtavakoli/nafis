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
                  <TableLabel>12</TableLabel>
                  تعداد کل فاکتور ها
                </Table.HeaderCell>
                {window.localStorage.type === "admin" ? (
                  <Table.HeaderCell className="text-center">
                    <TableLabel>11</TableLabel> سود کل
                  </Table.HeaderCell>
                ) : null}
                <Table.HeaderCell className="text-center">
                  <TableLabel>10</TableLabel>
                  فاکتورهای مانده‌حساب
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>9</TableLabel> مانده‌ حساب
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>8</TableLabel> کل پرداخت
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>7</TableLabel> پرداخت‌های کارت
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>6</TableLabel> پرداخت‌های نقد
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>5</TableLabel> پرداخت‌های چک
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>4</TableLabel> کل تخفیف داده‌شده
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>3</TableLabel> مبلغ خالص فروش
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>2</TableLabel> مبلغ خام فروش
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>1</TableLabel> تعداد اقلام
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>12</TableLabel>
                  <span>{priceToPersian(report.bills_data.length)}</span>
                </Table.Cell>
                {window.localStorage.type === "admin" ? (
                  <Table.Cell className="text-center norm-latin" collapsing>
                    <TableLabel>11</TableLabel>
                    <span>{priceToPersian(report.total_profit)}</span>
                  </Table.Cell>
                ) : null}
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>10</TableLabel>
                  <span>
                    {priceToPersian(report.bills_with_reminded_status)}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>9</TableLabel>
                  <span>{priceToPersian(report.total_reminded_payments)}</span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>8</TableLabel>
                  <span>{priceToPersian(report.total_paid)}</span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>7</TableLabel>
                  <span>{priceToPersian(report.total_card_paid)}</span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>6</TableLabel>
                  <span>{priceToPersian(report.total_cash_paid)}</span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>5</TableLabel>
                  <span>{priceToPersian(report.total_cheque_paid)}</span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>44</TableLabel>
                  <span>{priceToPersian(report.total_discount)}</span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>3</TableLabel>
                  <span>{priceToPersian(report.total_final_price)}</span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>2</TableLabel>
                  <span>{priceToPersian(report.total_price)}</span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>1</TableLabel>
                  <span>{priceToPersian(report.total_items)}</span>
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
                  <TableLabel>10</TableLabel>
                  قیمت کل
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>9</TableLabel>
                  قیمت خام بدون تخفیف
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>8</TableLabel>
                  تخفیف کل
                </Table.HeaderCell>
                {window.localStorage.type === "admin" ? (
                  <Table.HeaderCell className="text-center">
                    <TableLabel>7</TableLabel>
                    سود
                  </Table.HeaderCell>
                ) : null}
                <Table.HeaderCell className="text-center">
                  <TableLabel>6</TableLabel>
                  تعداد اقلام
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>5</TableLabel>
                  تاریخ بسته شدن
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>4</TableLabel>
                  شماره تلفن خریدار
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>3</TableLabel>
                  شعبه
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>2</TableLabel>
                  نام فروشنده
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  <TableLabel>1</TableLabel>
                  شماره فاکتور
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
                          <TableLabel>10</TableLabel>
                          <span>{priceToPersian(item.final_price)}</span>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel>9</TableLabel>
                          <span>{priceToPersian(item.price)}</span>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel>8</TableLabel>
                          <span>{priceToPersian(item.total_discount)}</span>
                        </Table.Cell>
                        {window.localStorage.type === "admin" ? (
                          <Table.Cell
                            className="text-center norm-latin"
                            collapsing
                          >
                            <TableLabel>7</TableLabel>
                            <span>{priceToPersian(item.profit)}</span>
                          </Table.Cell>
                        ) : null}
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel>6</TableLabel>
                          <span>{item.items_count}</span>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel>5</TableLabel>
                          <span>{standardTimeToJalaali(item.close_date)}</span>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel>4</TableLabel>
                          <span>{item.buyer.phone_number}</span>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel>3</TableLabel>
                          <span>{item.branch && item.branch.name}</span>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel>2</TableLabel>
                          <span>{item.seller.username}</span>
                        </Table.Cell>
                        <Table.Cell
                          className="text-center norm-latin"
                          collapsing
                        >
                          <TableLabel>1</TableLabel>
                          <span>{item.bill_code}</span>
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
