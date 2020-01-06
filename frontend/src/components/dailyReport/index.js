import React from "react";
import { connect } from "react-redux";
import { getDailyReport } from "../../actions/BillActions";
import { Table, Button, Icon } from 'semantic-ui-react'
import {
  priceToPersian,
  enToFa
} from "../utils/numberUtils";

import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import LoadingBar from '../utils/loadingBar'
import NotFound from '../utils/notFound'
import '../../scss/bootstrap.scss';
const TOMAN = "تومان";

class DailyReport extends React.Component {
  state = {
    receipt: {},
    bill: {},
    dailyReport: {},
    firstTime:true
  };
  componentDidMount() {
    this.props.getDailyReport().then((res) => {
      console.log(this.props.dailyReport);
      this.setState({ firstTime:false,dailyReport: this.props.dailyReport });
    })
  }
  bills = () => {
    return (<Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-right" colSpan='12'>فاکتور های بسته شده</Table.HeaderCell>
          </Table.Row>
      </Table.Header>
      {this.prefetchModule()}
      {this.state.dailyReport.bills_data && this.state.dailyReport.bills_data.length > 0 ? (
      <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-center">عملیات</Table.HeaderCell>
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
        ) : null}
          
      <Table.Body>
        {this.state.dailyReport.bills_data?this.state.dailyReport.bills_data.map((item) => {
          return (<Table.Row>
            <Table.Cell className="text-center norm-latin" collapsing>
               <Button as="a" href={`/factor/${item.pk}/print`} target="_blank" icon labelPosition='right' color="yellow">
                    <span className="yekan" >چاپ فاکتور</span>
                    <Icon name='print' />
                </Button>
            </Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(item.final_price)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(item.price)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(item.total_discount)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(item.profit)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{item.items_count}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{standardTimeToJalaali(item.close_date)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{item.buyer.phone_number}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{item.branch && item.branch.name}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{item.seller.username}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{item.bill_code}</span></Table.Cell>
          </Table.Row>);
        }):<React.Fragment></React.Fragment>}
        </Table.Body>
      </Table>)
  }
  prefetchModule = () => {
    console.log('conditional',this.state.firstTime,!this.state.dailyReport.total_price && !this.state.firstTime)
    
    if (this.state.firstTime) {
      return <LoadingBar />
    } else if (!this.state.dailyReport.total_price && !this.state.firstTime) {
      return <NotFound />
    } else {
      return null
    }
  }
  dailyReport = () => {
    return (<Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-right" colSpan='12'>گزارش روزانه</Table.HeaderCell>
          </Table.Row>
      </Table.Header>
      {this.prefetchModule()}
      {this.state.dailyReport.total_price ? (
        <React.Fragment>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-center">تعداد کل فاکتور ها</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> سود کل</Table.HeaderCell>
            <Table.HeaderCell className="text-center">‌فاکتورهای مانده‌حساب</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> مانده‌ حساب</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> کل پرداخت</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> پرداخت‌های کارت</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> پرداخت‌های نقد</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> پرداخت‌های چک</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> کل تخفیف داده‌شده</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> مبلغ خالص فروش</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> مبلغ خام فروش</Table.HeaderCell>
            <Table.HeaderCell className="text-center"> تعداد اقلام</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.bills_data.length)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_profit)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.bills_with_reminded_status)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_reminded_payments)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_paid)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_card_paid)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_cash_paid)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_cheque_paid)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_discount)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_final_price)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_price)}</span></Table.Cell>
            <Table.Cell className="text-center norm-latin" collapsing><span>{priceToPersian(this.state.dailyReport.total_items)}</span></Table.Cell>
          </Table.Row>
        </Table.Body>
        </React.Fragment>
      ):null}
    
      </Table>)
  }
  render() {
    return (
      <React.Fragment>
        {this.dailyReport()}
        {this.bills()}
      </React.Fragment>
      );
  }
}
const mapStateToProps = state => {
  return {
    dailyReport: state.bills.dailyReport,
  };
};
export default connect(mapStateToProps, { getDailyReport })(DailyReport);
