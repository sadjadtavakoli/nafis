import React from "react";
import { connect } from "react-redux";
import { getDailyReport } from "../../actions/BillActions";
import {
  Table,
  Button,
  Icon,
  Container,
  Segment,
  Header
} from "semantic-ui-react";
import { priceToPersian } from "../utils/numberUtils";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import LoadingBar from "../utils/loadingBar";
import TableLabel from "../utils/tableLabelGenerator";
import NotFound from "../utils/notFound";
import "../../scss/bootstrap.scss";
import { isPermit } from "../mainPage/permission";

class DailyReport extends React.Component {
  state = {
    receipt: {},
    bill: {},
    dailyReport: {},
    firstTime: true
  };

  componentDidMount() {
    this.props.getDailyReport().then(res => {
      this.setState({ firstTime: false, dailyReport: this.props.dailyReport });
    });
    this.setJob();
  }

  bills = () => {
    return (
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-right" colSpan="12">
              فاکتور های بسته شده
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {this.prefetchModule()}
        {this.state.dailyReport.bills_data &&
        this.state.dailyReport.bills_data.length > 0 ? (
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
              {isPermit("admin", this.state.job) ? (
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
        ) : null}

        <Table.Body>
          {this.state.dailyReport.bills_data ? (
            this.state.dailyReport.bills_data.map(item => {
              return (
                <Table.Row>
                  <Table.Cell className="text-center norm-latin" collapsing>
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
                  <Table.Cell className="text-center norm-latin" collapsing>
                    <TableLabel>10</TableLabel>
                    <span>{priceToPersian(item.final_price)}</span>
                  </Table.Cell>
                  <Table.Cell className="text-center norm-latin" collapsing>
                    <TableLabel>9</TableLabel>
                    <span>{priceToPersian(item.price)}</span>
                  </Table.Cell>
                  <Table.Cell className="text-center norm-latin" collapsing>
                    <TableLabel>8</TableLabel>
                    <span>{priceToPersian(item.total_discount)}</span>
                  </Table.Cell>
                  {isPermit("admin", this.state.job) ? (
                    <Table.Cell className="text-center norm-latin" collapsing>
                      <TableLabel>7</TableLabel>
                      <span>{priceToPersian(item.profit)}</span>
                    </Table.Cell>
                  ) : null}
                  <Table.Cell className="text-center norm-latin" collapsing>
                    <TableLabel>6</TableLabel>
                    <span>{item.items_count}</span>
                  </Table.Cell>
                  <Table.Cell className="text-center norm-latin" collapsing>
                    <TableLabel>5</TableLabel>
                    <span>{standardTimeToJalaali(item.close_date)}</span>
                  </Table.Cell>
                  <Table.Cell className="text-center norm-latin" collapsing>
                    <TableLabel>4</TableLabel>
                    <span>{item.buyer.phone_number}</span>
                  </Table.Cell>
                  <Table.Cell className="text-center norm-latin" collapsing>
                    <TableLabel>3</TableLabel>
                    <span>{item.branch && item.branch.name}</span>
                  </Table.Cell>
                  <Table.Cell className="text-center norm-latin" collapsing>
                    <TableLabel>2</TableLabel>
                    <span>{item.seller.username}</span>
                  </Table.Cell>
                  <Table.Cell className="text-center norm-latin" collapsing>
                    <TableLabel>1</TableLabel>
                    <span>{item.bill_code}</span>
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <React.Fragment></React.Fragment>
          )}
        </Table.Body>
      </Table>
    );
  };

  setJob = () => {
    this.setState({ job: localStorage.getItem("type") });
  };

  prefetchModule = () => {
    if (this.state.firstTime) {
      return <LoadingBar />;
    } else if (!this.state.dailyReport.total_price && !this.state.firstTime) {
      return <NotFound />;
    } else {
      return null;
    }
  };

  dailyReport = () => {
    return (
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-right" colSpan="12">
              گزارش روزانه
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {this.prefetchModule()}
        {this.state.dailyReport.total_price ? (
          <React.Fragment>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="text-center">
                  <TableLabel>12</TableLabel>
                  تعداد کل فاکتور ها
                </Table.HeaderCell>
                {isPermit("admin", this.state.job) ? (
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
                  <span>
                    {priceToPersian(this.state.dailyReport.bills_data.length)}
                  </span>
                </Table.Cell>
                {isPermit("admin", this.state.job) ? (
                  <Table.Cell className="text-center norm-latin" collapsing>
                    <TableLabel>11</TableLabel>
                    <span>
                      {priceToPersian(this.state.dailyReport.total_profit)}
                    </span>
                  </Table.Cell>
                ) : null}
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>10</TableLabel>
                  <span>
                    {priceToPersian(
                      this.state.dailyReport.bills_with_reminded_status
                    )}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>9</TableLabel>
                  <span>
                    {priceToPersian(
                      this.state.dailyReport.total_reminded_payments
                    )}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>8</TableLabel>
                  <span>
                    {priceToPersian(this.state.dailyReport.total_paid)}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>7</TableLabel>
                  <span>
                    {priceToPersian(this.state.dailyReport.total_card_paid)}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>6</TableLabel>
                  <span>
                    {priceToPersian(this.state.dailyReport.total_cash_paid)}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>5</TableLabel>
                  <span>
                    {priceToPersian(this.state.dailyReport.total_cheque_paid)}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>44</TableLabel>
                  <span>
                    {priceToPersian(this.state.dailyReport.total_discount)}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>3</TableLabel>
                  <span>
                    {priceToPersian(this.state.dailyReport.total_final_price)}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>2</TableLabel>
                  <span>
                    {priceToPersian(this.state.dailyReport.total_price)}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-center norm-latin" collapsing>
                  <TableLabel>1</TableLabel>
                  <span>
                    {priceToPersian(this.state.dailyReport.total_items)}
                  </span>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </React.Fragment>
        ) : null}
      </Table>
    );
  };

  render() {
    return (
      <Container>
        <Segment stacked className="rtl">
          <Header as="h2" className="yekan" style={{ display: "inline" }}>
            گزارش های روزانه
          </Header>
          <Button
            circular
            icon="arrow left"
            style={{ float: "left" }}
            onClick={() => window.history.back()}
          />
        </Segment>
        {this.dailyReport()}
        {this.bills()}
      </Container>
    );
  }
}
const mapStateToProps = state => {
  return {
    dailyReport: state.bills.dailyReport
  };
};
export default connect(mapStateToProps, { getDailyReport })(DailyReport);
