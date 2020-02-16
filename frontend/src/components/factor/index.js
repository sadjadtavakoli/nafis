import React from "react";
import { connect } from "react-redux";
import { getBillREQUEST } from "../../actions/BillActions";
import logo from "../../assets/logo_printable.png";
// import "./bootstrap.min.css";
import {
  priceToPersian,
  enToFa,
  phoneNumberBeautifier
} from "../utils/numberUtils";
import { getTodayJalaali, getNow } from "../utils/jalaaliUtils";
import { isEmptyObject } from "../../utils/FunctionalUtils";
import "../../scss/bootstrap.scss";
const TOMAN = "تومان";
const BORDER_BOTTOM = { borderBottom: "3px solid black" };
class PrintFactor extends React.Component {
  state = {
    receipt: {},
    bill: {}
  };

  componentDidMount() {
    const params = this.props.match.params;
    const resivedData = this.props.location.state;
    if (
      (params.id && params.print === "print") ||
      !(resivedData.pk === params.id && !isEmptyObject(resivedData))
    )
      this.props.getBillREQUEST(params.id).then(res => {
        console.log("res", res);
        this.setState({ bill: res, receipt: res.items }, () => {
          if (params.print === "print") {
            window.print();
          }
        });
      });
    else this.setState({ bill: resivedData, receipt: resivedData.items });
    setTimeout(() => {
      console.log(this.state.bill);
    }, 3000);
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
            <p className="d-flex align-items-center justify-content-center col-1 text-center font-weight-bold border-left-3 m-0 p-2">
              {enToFa(index + 1)}
            </p>
            <p className="d-flex align-items-center justify-content-center col-3 text-center font-weight-bold border-left-3 m-0 py-0 px-0">
              <small className="w-100">
                <b>{enToFa(item.product.name)}</b>
                <hr class="m-0" style={BORDER_BOTTOM} />
                <b>{enToFa(item.product.pk)}</b>
              </small>
            </p>
            <p className="d-flex align-items-center justify-content-center col text-center font-weight-bold border-left-3 m-0 p-2">
              {enToFa(item.amount)}
            </p>
            <p className="d-flex align-items-center justify-content-center col text-center font-weight-bold border-left-3 m-0 p-2">
              {enToFa(priceToPersian(parseInt(item.product.selling_price)))}
            </p>
            <p className="d-flex align-items-center justify-content-center col text-center font-weight-bold border-left-3 m-0 p-2">
              {enToFa(priceToPersian(item.discount))}
            </p>
            <p className="d-flex align-items-center justify-content-center col text-center font-weight-bold m-0 p-2">
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
        <div
          className="container rtl py-2"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <div style={{ width: "76mm" }}>
            <div className="row border-black border-radius-7 mb-2">
              <div className="col-12 d-flex align-items-center justify-content-center">
                <img src={logo} height="200" />
              </div>
              {/* <div className="col-6 d-flex align-items-center justify-content-center">
              <div className="row norm-latin">
                <h1 className="col">GALLERY</h1>
                <h1 className="col">NAFIS</h1>
              </div>
            </div> */}
            </div>
            <div className="row border-black border-radius-7 mb-2 rtl text-right p-2">
              <p className="col-3 font-weight-bold p-1">
                <span>شماره‌فاکتور:</span>
              </p>
              <p className="col-3 font-weight-bold p-1">
                <span>{enToFa(this.state.bill.bill_code)}</span>
              </p>

              <p className="col-3 font-weight-bold p-1">
                <span>نام فروشنده:</span>
              </p>
              <p className="col-3 font-weight-bold">
                <span>
                  {this.state.bill.seller &&
                    this.state.bill.seller.first_name +
                      " " +
                      this.state.bill.seller.last_name}
                </span>
              </p>

              <p className="col-3 font-weight-bold p-1">
                <span>تاریخ فاکتور:</span>
              </p>
              <p className="col-3 font-weight-bold p-1">
                <span>{enToFa(getTodayJalaali())}</span>
              </p>
              <p className="col-3 font-weight-bold p-1">
                <span>ساعت‌صدور:</span>
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
                    this.state.bill.buyer && this.state.bill.buyer.phone_number
                  )}
                </span>
              </p>

              <p className="col-3 font-weight-bold p-1">
                <span>صندوق:</span>
              </p>
              <p className="col-3 font-weight-bold p-1">
                <span></span>
              </p>
            </div>
            <div className="row border-black border-radius-7 mb-1 rtl text-right">
              <p className="col-1 norm-latin text-center font-weight-bold border-left-3 m-0 py-2 px-0">
                <small>
                  <b>#</b>
                </small>
              </p>
              <p className="col-3 text-center font-weight-bold border-left-3 m-0 py-0 px-0">
                <small>
                  <b>شرح کالا</b>
                  <hr class="m-0" style={BORDER_BOTTOM} />
                  <b>کد کالا</b>
                </small>
              </p>
              <p className="d-flex justify-content-center align-items-center col text-center font-weight-bold border-left-3 m-0 py-2 px-0">
                <small>
                  <b>مقدار</b>
                </small>
              </p>
              <p className="d-flex justify-content-center align-items-center col text-center font-weight-bold border-left-3 m-0 py-2 px-0">
                <small>
                  <b>مبلغ‌واحد</b>
                </small>
              </p>
              <p className="d-flex justify-content-center align-items-center col text-center font-weight-bold border-left-3 m-0 py-2 px-0">
                <small>
                  <b>تخفیف</b>
                </small>
              </p>
              <p className="d-flex justify-content-center align-items-center col text-center font-weight-bold m-0 py-2 px-0">
                <small>
                  <b>مبلغ‌خالص</b>
                </small>
              </p>
            </div>
            {this.renderItems()}

            <div className="row-not-flex border-black border-radius-7 mb-1 rtl text-right">
              <div className="row border-bottom-3">
                <div className="col-6 font-weight-bold py-2 px-0 h5 text-left">
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
                <div className="col-6 font-weight-bold py-2 px-0 h5 text-left">
                  تخفیف کالایی:
                </div>
                <div className="col font-weight-bold p-2 h5 text-center">
                  {enToFa(
                    priceToPersian(this.state.bill.buyer_special_discount)
                  )}
                </div>
                <div className="col font-weight-bold p-2 h5 text-left">
                  {this.state.bill.buyer_special_discount ? TOMAN : "-"}
                </div>
              </div>

              <div className="row ">
                <div className="col-6 font-weight-bold py-2 px-0 h5 text-left">
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
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    res: state
  };
};

export default connect(mapStateToProps, { getBillREQUEST })(PrintFactor);
