import React from "react";
import { connect } from "react-redux";
import { getDailyReport } from "../../actions/BillActions";
import { Table, Container } from 'semantic-ui-react'
import {
  priceToPersian,
  enToFa
} from "../utils/numberUtils";

import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import LoadingBar from '../utils/loadingBar'
import '../../scss/bootstrap.scss';
const TOMAN = "تومان";

class DailyReport extends React.Component {
  state = {
    receipt: {},
    bill: {},
    dailyReport:{}
  };
  componentDidMount() {
    this.props.getDailyReport().then((res) => {
      console.log(this.props.dailyReport);
      this.setState({ dailyReport: this.props.dailyReport });
    })
  }
  bills = () => {
    return (<Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-right" colSpan='11'>فاکتور های بسته شده</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {this.state.dailyReport.bills_data && this.state.dailyReport.bills_data.length > 0 ? (
      <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-center">قیمت کل</Table.HeaderCell>
            <Table.HeaderCell className="text-center">قیمت خام بدون تخفیف</Table.HeaderCell>
            <Table.HeaderCell className="text-center">تخفیف کل</Table.HeaderCell>
            <Table.HeaderCell className="text-center">سود</Table.HeaderCell>
            <Table.HeaderCell className="text-center">تعداد اقلام</Table.HeaderCell>
            <Table.HeaderCell className="text-center">تاریخ بسته شدن</Table.HeaderCell>
            <Table.HeaderCell className="text-center">شماره تلفن خریدار</Table.HeaderCell>
            <Table.HeaderCell className="text-center">شعبه</Table.HeaderCell>
            <Table.HeaderCell className="text-center">نام فروشنده</Table.HeaderCell>
            <Table.HeaderCell className="text-center">شماره فاکتور</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        ) : <LoadingBar/>}
          
      <Table.Body>
        {this.state.dailyReport.bills_data?this.state.dailyReport.bills_data.map((item) => {
          return (<Table.Row>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(item.final_price)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(item.price)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(item.total_discount)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(item.profit)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{item.items_count}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{standardTimeToJalaali(item.close_date)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{item.buyer.phone_number}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{item.branch && item.branch.name}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{item.seller.username}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{item.pk}</span></Table.Cell>
          </Table.Row>);
        }):<></>}
        </Table.Body>
      </Table>)
  }
  dailyReport = () => {
    return (<Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-right" colSpan='11'>گزارش روزانه</Table.HeaderCell>
          </Table.Row>
      </Table.Header>
      {this.state.dailyReport.total_price ? (
        <>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-center">‌فاکتورهای مانده‌حساب</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> پرداخت‌های کارت</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> پرداخت‌های نقد</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> پرداخت‌های چک</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> کل تخفیف داده‌شده</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> مبلغ خالص فروش</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> تعداد اقلام</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> کل پرداخت</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> مبلغ خام فروش</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> سود کل</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> مانده‌ حساب</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.bills_with_reminded_status)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_card_paid)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_cash_paid)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_cheque_paid)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_discount)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_final_price)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_items)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_paid)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_price)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_profit)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_reminded_payments)}</span></Table.Cell>
          </Table.Row>
        </Table.Body>
        </>
      ):<LoadingBar/>}
    
      </Table>)
  }
  render() {
    return (
      <>
        {this.dailyReport()}
        {this.bills()}
      </>
      );
  }
}
const mapStateToProps = state => {
  return {
    dailyReport: state.bills.dailyReport,
  };
};
export default connect(mapStateToProps, { getDailyReport })(DailyReport);
