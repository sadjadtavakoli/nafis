import React from "react";
// import animejs from "animejs";
import { connect } from "react-redux";
// import { initReceipt,navBarDisplay } from "../../actions";
// import Checkbox from "react-simple-checkbox";


// import MainPageItem from "../basic/mainPageItem";

// import cart from "../../assets/cart.svg";
// import warehouse from "../../assets/warehouse.svg";
// import truck from "../../assets/truck.svg";
// import notifications from "../../assets/notifications.svg";
// import cashRegister from "../../assets/register.svg";
// import customers from "../../assets/customers.svg";
// import reports from "../../assets/reports.svg";
// import Modal from "../Modal";
import history from "../../history";
// import Input from "../basic/basicInput";
// import { phoneNumberBeautifier, enToFa } from '../utils/numberUtils'
// const WRONG_MODAL_INPUT_STYLE = { color: '#dc3545', animationName: 'autoShadowAnimation-red', animationIterationCount: 'infinite', animationDuration: '2s', animationDirection: 'alternate-reverse', animationTimingFunction: 'linear' };
// const MAIN_PAGE_ITEMS = [
//   {
//     name: "Receipt",
//     label: "فروش",
//     image: cart
//   },
//   {
//     name: "Depository",
//     label: "انبار داری",
//     image: warehouse
//   },
//   {
//     name: "Providers",
//     label: "تامین کننده",
//     image: truck
//   },
//   {
//     name: "Customers",
//     label: "مشتریان",
//     image: customers
//   },
//   {
//     name: "Reports",
//     label: "گزارشات",
//     image: reports
//   },
//   {
//     name: "CashRegister",
//     label: "صندوق",
//     image: cashRegister
//   },
//   {
//     name: "Notifications",
//     label: "هشدارها",
//     image: notifications
//   }
// ];

// const MAIN_PAGE_ITEMS_STOCKMAN = [
//   {
//     name: "CashRegister",
//     label: "صندوق",
//     image: cashRegister
//   },
//   {
//     name: "Customers",
//     label: "مشتریان",
//     image: customers
//   },
//   {
//     name: "Depository",
//     label: "انبار داری",
//     image: warehouse
//   },
//   {
//     name: "Receipt",
//     label: "فروش",
//     image: cart
//   }
// ];

// const MAIN_PAGE_ITEMS_ACCOUNTANT = [
//   {
//     name: "Depository",
//     label: "انبار داری",
//     image: warehouse
//   },
//   {
//     name: "Providers",
//     label: "تامین کننده",
//     image: truck
//   }
// ];

// const MAIN_PAGE_ITEMS_SALESPERSON = [
//   {
//     name: "Receipt",
//     label: "فروش",
//     image: cart
//   },
//   {
//     name: "CashRegister",
//     label: "صندوق",
//     image: cashRegister
//   },
//   {
//     name: "Reports",
//     label: "گزارشات",
//     image: reports
//   },
// ];

// const MAIN_PAGE_ITEMS_CASHIER = [
//   {
//     name: "Receipt",
//     label: "فروش",
//     image: cart
//   },
//   {
//     name: "CashRegister",
//     label: "صندوق",
//     image: cashRegister
//   },
//   {
//     name: "Customers",
//     label: "مشتریان",
//     image: customers
//   }
// ];

class MainPage extends React.Component {
  state = { showModal: false, modalInput: "" };
//   componentWillUnmount() {
//     this.props.navBarDisplay({ navBarDisplay: 'صفحه نخست' });
// }
//   componentDidMount() {
//     this.props.navBarDisplay({ navBarDisplay: 'صفحه نخست' });
//     const tl = animejs.timeline({
//       easing: "easeOutExpo",
//       duration: 3000
//     });

//     tl.add({
//       targets: ".main-page__item",
//       opacity: 1
//     });
//   }

//   setItems = type => {
//     switch (type) {
//       case "admin":
//         return MAIN_PAGE_ITEMS;
//       case "accountant":
//         return MAIN_PAGE_ITEMS_ACCOUNTANT;
//       case "stockman":
//         return MAIN_PAGE_ITEMS_STOCKMAN;
//       case "cashier":
//         return MAIN_PAGE_ITEMS_CASHIER;
//       case "salesperson":
//       default:
//         return MAIN_PAGE_ITEMS_SALESPERSON;
//     }
//   };

//   renderModal = () => {
//     return this.state.showModal ? (
//       <Modal
//         hideModal={this.hideModal}
//         onCancel={this.hideModal}
//         onSubmit={this.onReceipt}
//         header="کد مشتری را وارد کنید"
//         modalSubmitText="ادامه"
//       >
//         <>
//           <h1 id="phone-number-input" style={(this.state.wrongModalInput ? WRONG_MODAL_INPUT_STYLE : {  })} className="ltr">{this.state.modalInput.length>0?
//             enToFa('0' + phoneNumberBeautifier(parseInt(this.state.modalInput))):<span className="text-white">-</span>}</h1>
//             <div className="rtl">
//               {this.state.wrongModalInput ? <p className="text-right pt-1"> <small className="d-flex align-items-center w-100 text-danger text-right"><span> شماره موبایل باید ۱۱ رقم باشد</span><span className="text-success font-weight-bold pointer mx-1 px-2" style={{border:'1px solid #28a745',borderRadius:4}} onClick={this.pureOnReceipt}>حساس نشو!</span></small></p> : null}
//             </div>
//           <input
//             type="number"
//              autofocus="true"
//             className="form-control form-control-sm ltr text-center w-25"
//             onChange={e => this.setState({ modalInput: e.target.value.slice(0, 11) })}
//             value={this.state.modalInput.slice(0,11)}
//             defaultValue={this.state.modalInput.slice(0, 11)} />
          
//           {/* <Input
//             full
//             label=""
//             input={{
//               onChange: e => this.setState({ modalInput: e.target.value }),
//               value: this.state.modalInput
//             }}
//           /> */}
//         </>
//       </Modal>
//     ) : null;
//   };

//   hideModal = () => {
//     this.setState({
//       showModal: false
//     });
//   };

//   showModal = () => {
//     this.setState({
//       showModal: true
//     });
//   };

//   onClickItems = name => {
//     switch (name) {
//       case "Receipt":
//         return this.showModal;
//       case "Depository":
//         return () => history.push("/depository");
//       case "Providers":
//         return () => history.push("/providers");
//       case "Customers":
//         return () => history.push("/customers");
//       case "Reports":
//         return () => history.push("/reports");
//       case "CashRegister":
//         return () => history.push("/cashregister");
//       case "Notifications":
//         return () => history.push("/notifications");
//       default:
//         return null;
//     }
//   };
//   pureOnReceipt = () => {
//     this.setState({wrongModalInput:false})
//      this.props
//         .initReceipt({
//           customer: parseInt(this.state.modalInput),
//           seller: this.props.currentUser
//             ? this.props.currentUser
//             : localStorage.getItem("user")
//             ? localStorage.getItem("user")
//             : "",
//           receipt_status: "active",
//           items: []
//         })
//         .then(() => {
//           history.push(`/receipt/${this.props.nextReceipt}`);
//         });
//   }
//   onReceipt = () => {
//     if (this.state.modalInput.length < 10) {
//       this.setState({ wrongModalInput: true });
//     } else {
//       this.pureOnReceipt()
//     }
     
    
//     // if (this.props.nextReceipt === null) {
//     //     alert('اتصال خود به اینترنت را بررسی نمایید و پس از چند لحظه مجددا تلاش کنید');
//     //     return;
//     // }
//   };

  render() {
    return (
      <div className="main-page__container">
            <div className="main-page__items-container">
                MAIN PAGE
          {/* {this.props.type
            ? this.setItems(this.props.type).map((item, index) => {
                return (
                  <MainPageItem
                    key={index}
                    name={item.name}
                    label={item.label}
                    image={item.image}
                    onClick={this.onClickItems(item.name)}
                  />
                );
              })
            : null} */}
        </div>
        {/* {this.renderModal()} */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    nextReceipt: state.receipts.nextReceipt,
    currentUser: state.auth.currentUser
      ? state.auth.currentUser
      : localStorage.getItem("user")
      ? localStorage.getItem("user")
      : "",
    type: state.auth.type
      ? state.auth.type
      : localStorage.getItem("type")
      ? localStorage.getItem("type")
      : ""
  };
};

export default connect(
    null,null
//   mapStateToProps,
//   { initReceipt,navBarDisplay }
)(MainPage);
