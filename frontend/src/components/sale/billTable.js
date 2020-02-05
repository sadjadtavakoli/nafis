import React from "react";
import { connect } from "react-redux";
import { Table, Pagination, Button, Icon, Popup } from "semantic-ui-react";
import { getActiveBill } from "../../actions/SaleActions";
import { digitToComma, phoneNumberBeautifier } from "../utils/numberUtils";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import ShowInformationModal from "./showInformationModal";
import LoadingBar from "../utils/loadingBar";
import NotFound from "../utils/notFound";
import NewBillPopup from "./newBillPopup";

const colSpan = 7;
class BillTable extends React.Component {
  state = {
    activeBill: [],
    totalPageCount: 1,
    isOpenInformationModal: false,
    itemData: {},
    isOpenAddItem: NaN,
    activePage: 1,
    firstTime: true,
    openingModal: false
  };
  componentDidUpdate(newProps) {
    if (
      newProps.newBillData &&
      newProps.newBillData.pk !== this.props.newBillData.pk
    ) {
      // console.log('TRUUUUUUUUUEEEE', newProps.newBillData, this.props.newBillData);
      this.getActiveBill(this.state.activePage);
    }
  }
  componentDidMount() {
    this.getActiveBill();
  }
  getActiveBill = (page = 1) => {
    this.props.getActiveBill(page).then(() => {
      this.setState({
        firstTime: false,
        activeBill: this.props.activeBill ? this.props.activeBill.results : {},
        totalPageCount: this.props.activeBill
          ? Math.ceil(this.props.activeBill.count / 25)
          : 0
      });
    });
  };
  changePage = (_, { activePage }) => {
    this.setState({ activePage }, () => {
      this.getActiveBill(this.state.activePage);
    });
  };
  closeInformationModal = () => {
    this.getActiveBill(this.state.activePage);
    this.setState({ isOpenInformationModal: false });
  };
  openInformationModal = itemData => {
    this.setState({ itemData }, () => {
      this.setState({ isOpenInformationModal: true });
    });
  };
  toggleAddItemPopup = id => {
    this.setState({ isOpenAddItem: id });
  };
  submitItemPopup = data => {
    this.setState(
      {
        // itemsDOM: [...this.state.itemsDOM, itemDOM],
        itemsDataSheet: [...this.state.itemsDataSheet, data],
        formValidation: { ...this.state.formValidation, items: false }
      },
      () => {}
    );
    this.toggleAddItemPopup();
  };
  render() {
    if (this.state.activeBill.length === 0 && !this.state.firstTime) {
      return <NotFound />;
    }
    if (this.state.activeBill.length > 0) {
      return (
        <div>
          <ShowInformationModal
            key={this.state.isOpenInformationModal}
            refetch={() => this.getActiveBill(this.state.activePage)}
            data={this.state.itemData}
            open={this.state.isOpenInformationModal}
            onClose={this.closeInformationModal}
          />

          <Table celled striped className="">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={colSpan} className="rtl text-right">
                  <span>لیست فاکتور های فعال</span>
                  <Button
                    icon
                    onClick={() => this.getActiveBill(this.state.activePage)}
                  >
                    <Icon name="repeat" />
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell className="text-center">
                  عملیات
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  تعداد پرداختی ها
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  تاریخ ثبت
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  مبلغ کل
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  مبلغ نهایی
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  تخفیف کل
                </Table.HeaderCell>
                <Table.HeaderCell className="text-center">
                  شماره تلفن خریدار
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.state.activeBill.map((item, index) => {
                return (
                  <React.Fragment>
                    <Table.Row key={index}>
                      <Table.Cell className="norm-latin text-center">
                        <Popup
                          content={
                            <NewBillPopup
                              refetch={() =>
                                this.getActiveBill(this.state.activePage)
                              }
                              phoneNumber={item.buyer.phone_number}
                              pk={item.pk}
                              onClose={() => this.toggleAddItemPopup(NaN)}
                              onSubmit={this.submitItemPopup}
                            />
                          }
                          open={this.state.isOpenAddItem === index}
                          className="no-filter"
                          position="bottom center"
                          wide="very"
                          trigger={
                            <Button
                              onClick={() => this.toggleAddItemPopup(index)}
                              icon
                              labelPosition="right"
                              color="green"
                            >
                              <span className="yekan">آیتم جدید</span>
                              <Icon name="add" />
                            </Button>
                          }
                          color="green"
                          size="huge"
                          icon="add"
                        />

                        <Button
                          onClick={() => this.openInformationModal(item)}
                          icon
                          labelPosition="right"
                          color="yellow"
                        >
                          <span className="yekan">مشاهده</span>
                          <Icon name="info" />
                        </Button>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center rtl">
                        <span>{item.payments.length}</span>&nbsp;
                        <span className="yekan">پرداختی</span>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center">
                        <span>{standardTimeToJalaali(item.create_date)}</span>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center rtl">
                        <span>{digitToComma(item.price)}</span>&nbsp;
                        <span className="yekan">تومان</span>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center rtl">
                        <b>
                          <span>{digitToComma(item.final_price)}</span>&nbsp;
                          <span className="yekan">تومان</span>
                        </b>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center rtl">
                        {item.total_discount ? (
                          <React.Fragment>
                            <span>{digitToComma(item.total_discount)}</span>
                            <span className="yekan">تومان</span>
                          </React.Fragment>
                        ) : (
                          "--"
                        )}{" "}
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center">
                        <span>
                          {phoneNumberBeautifier(item.buyer.phone_number)}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  </React.Fragment>
                );
              })}
            </Table.Body>
            <Table.Footer fullWidth hidden={this.state.totalPageCount < 2}>
              <Table.Row>
                <Table.HeaderCell colSpan={colSpan} className="norm-latin">
                  <Pagination
                    className="norm-latin"
                    defaultActivePage={1}
                    onPageChange={this.changePage}
                    totalPages={this.state.totalPageCount}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </div>
      );
    } else {
      return <LoadingBar />;
    }
  }
}

const mapStateToProps = state => {
  // console.log(';oair[8w098w09w09we',state)
  return {
    activeBill: state.sale.activeBill,
    newBillData: !state.sale.newBillData ? { pk: 0 } : state.sale.newBillData
    //     currentUser: state.auth.currentUser
    //       ? state.auth.currentUser
    //       : localStorage.getItem("user")
    //       ? localStorage.getItem("user")
    //       : "",
    //     type: state.auth.type
    //       ? state.auth.type
    //       : localStorage.getItem("type")
    //       ? localStorage.getItem("type")
    //       : ""
  };
};

export default connect(mapStateToProps, { getActiveBill })(BillTable);
