import React from "react";
import { connect } from "react-redux";
import { getBillREQUEST } from "../../actions/BillActions";
import logo from "../../assets/logo.png";
// import "./bootstrap.min.css";
import {
  priceToPersian,
  enToFa,
  phoneNumberBeautifier
} from "../utils/numberUtils";
import { getTodayJalaali, getNow } from "../utils/jalaaliUtils";
import { isEmptyObject } from "../../utils/FunctionalUtils";
import '../../scss/bootstrap.scss'
const TOMAN = "تومان";

class PrintFactor extends React.Component {
  state = {
    receipt: {},
    bill: {}
  };
  componentDidMount() {
    const params = this.props.match.params;
    const resivedData = this.props.location.state;
    // console.log(params,resivedData)

    if ( (params.id && params.print === 'print') || !((resivedData.pk) === params.id && !isEmptyObject(resivedData)))
      this.props.getBillREQUEST(params.id).then(res => {
        this.setState({ bill: res, receipt: res.items }, () => {
          if (params.print === 'print'){
            window.print();
          }
        });
      });
    else this.setState({ bill: resivedData, receipt: resivedData.items });
  }
  renderItems = () => {
    let final;
    if (this.state.bill.items)
      final = this.state.bill.items.map((item, index) => {
        return (
          <div
            key={index}
            className="row border-black border-radius-7 mb-1 rtl text-right"
          >
            <p className="col-1 text-center font-weight-bold border-left-3 m-0 p-2">
              {enToFa(index + 1)}
            </p>
            <p className="col-3 text-center font-weight-bold border-left-3 m-0 p-2">
              {enToFa(item.product.name)}
            </p>
            <p className="col text-center font-weight-bold border-left-3 m-0 p-2">
              {enToFa(item.amount)}
            </p>
            <p className="col text-center font-weight-bold border-left-3 m-0 p-2">
              {enToFa(priceToPersian(parseInt(item.product.selling_price)))}
            </p>
            <p className="col text-center font-weight-bold border-left-3 m-0 p-2">
              {enToFa(priceToPersian(item.discount))}
            </p>
            <p className="col text-center font-weight-bold m-0 p-2">
              {enToFa(priceToPersian(parseInt(item.price)))}
            </p>
          </div>
        );
      });
    return final;
  };
  render() {
    return (
      <div className="bootstrap factor">
        <div className="container rtl py-2">
          {/* <div className="row border-black border-radius-7 mb-2">
            <div className="col-6 d-flex align-items-center justify-content-center">
              <img src={logo} height="200" />
            </div>
            <div className="col-6 d-flex align-items-center justify-content-center">
              <div className="row norm-latin">
                <h1 className="col">GALLERY</h1>
                <h1 className="col">NAFIS</h1>
              </div>
            </div>
          </div> */}
          <div className="row border-black border-radius-7 mb-2 rtl text-right p-2">
            <p className="col-3 font-weight-bold p-1">
              <span>شماره فاکتور:</span>
            </p>
            <p className="col-3 font-weight-bold p-1">
              <span>{enToFa(this.state.bill.pk)}</span>
            </p>

            <p className="col-3 font-weight-bold p-1">
              <span>شماره نهایی:</span>
            </p>
            <p className="col-3 font-weight-bold p-1">
              <span>--</span>
            </p>

            <p className="col-3 font-weight-bold p-1">
              <span>تاریخ فاکتور:</span>
            </p>
            <p className="col-3 font-weight-bold p-1">
              <span>{enToFa(getTodayJalaali())}</span>
            </p>
            <p className="col-3 font-weight-bold p-1">
              <span>ساعت صدور:</span>
            </p>
            <p className="col-3 font-weight-bold p-1">
              <span>{enToFa(getNow())}</span>
            </p>

            <p className="col-3 font-weight-bold p-1">
              <span>کد مشترک:</span>
            </p>
            <p className="col-3 font-weight-bold p-1">
              <span>
                {enToFa(
                  (
                    this.state.bill.buyer && this.state.bill.buyer.pk
                  )
                )}
              </span>
            </p>

            <p className="col-3 font-weight-bold p-1">
              <span>صندوق:</span>
            </p>
            <p className="col-3 font-weight-bold p-1">
              <span>{this.state.bill.seller && this.state.bill.seller.pk}</span>
            </p>
          </div>
          <div className="row border-black border-radius-7 mb-1 rtl text-right">
            <p className="col-1 text-center font-weight-bold border-left-3 m-0 p-2">
              ردیف
            </p>
            <p className="col-3 text-center font-weight-bold border-left-3 m-0 p-2">
              شرح کالا
            </p>
            <p className="col text-center font-weight-bold border-left-3 m-0 p-2">
              مقدار
            </p>
            <p className="col text-center font-weight-bold border-left-3 m-0 p-2">
              مبلغ‌واحد
            </p>
            <p className="col text-center font-weight-bold border-left-3 m-0 p-2">
              تخفیف
            </p>
            <p className="col text-center font-weight-bold m-0 p-2">
              مبلغ‌خالص
            </p>
          </div>
          {this.renderItems()}

          <div className="row-not-flex border-black border-radius-7 mb-1 rtl text-right">
            <div className="row border-bottom-3">
              <div className="col font-weight-bold p-2 h5 text-left">
                جمع کل:
              </div>
              <div className="col font-weight-bold p-2 h5 text-center">
                {enToFa(priceToPersian(this.state.bill.price))}
              </div>
              <div className="col font-weight-bold p-2 h5 text-left">
                {this.state.bill.price ? TOMAN : "-"}
              </div>
            </div>
            <div className="row border-bottom-3">
              <div className="col font-weight-bold p-2 h5 text-left">
                تخفیف کالایی:
              </div>
              <div className="col font-weight-bold p-2 h5 text-center">
                {enToFa(priceToPersian(this.state.bill.buyer_special_discount))}
              </div>
              <div className="col font-weight-bold p-2 h5 text-left">
                {this.state.bill.buyer_special_discount ? TOMAN : "-"}
              </div>
            </div>
            <div className="row border-bottom-3">
              <div className="col font-weight-bold p-2 h5 text-left">
                تخفیف فاکتوری:
              </div>
              <div className="col font-weight-bold p-2 h5 text-center">
                {enToFa(priceToPersian(this.state.bill.total_discount))}
              </div>
              <div className="col font-weight-bold p-2 h5 text-left">
                {this.state.bill.total_discount ? TOMAN : "-"}
              </div>
            </div>
            <div className="row ">
              <div className="col font-weight-bold p-2 h5 text-left">
                مبلغ قابل پرداخت:
              </div>
              <div className="col font-weight-bold p-2 h5 text-center">
                {enToFa(priceToPersian(this.state.bill.final_price))}
              </div>
              <div className="col font-weight-bold p-2 h5 text-left">
                {this.state.bill.final_price ? TOMAN : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { getBillREQUEST })(PrintFactor);
