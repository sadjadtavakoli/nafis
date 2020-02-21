import React from "react";
import { Table, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { getActiveBills, deleteBill } from "../../actions/CashRegisterActions";
import { digitToComma } from "../utils/numberUtils";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import NotFound from "../utils/notFound";
import LoadingBar from "../utils/loadingBar";
import { toastr } from "react-redux-toastr";
import history from "../../history";

class CashRegisterTable extends React.Component {
  state = {
    fetch: false,
    noResult: false
  };

  componentDidMount() {
    this.getActiveBills();
  }

  getActiveBills = () => {
    this.props.getActiveBills().then(() => {
      this.setState({
        fetch: true
      });
      if (!this.props.activeBills.length) {
        this.setState({
          noResult: true
        });
      }
      console.log(this.props.activeBills);
    });
  };

  closeModal = () => {
    this.setState({
      open: true
    });
  };

  render() {
    return (
      <Table celled className="rtl text-center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="5" className="text-right">
              لیست فاکتورهای فعال
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {this.state.fetch ? (
          <React.Fragment>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="table-border-left">
                  موبایل خریدار
                </Table.HeaderCell>
                <Table.HeaderCell>اسم فروشنده</Table.HeaderCell>
                <Table.HeaderCell>مبلغ نهایی فاکتور</Table.HeaderCell>
                <Table.HeaderCell>تاریخ فاکتور</Table.HeaderCell>
                <Table.HeaderCell>عملیات فاکتور</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.props.activeBills.map(bill => {
                return (
                  <Table.Row>
                    <Table.Cell
                      className="table-border-left"
                      style={{ fontFamily: "arial" }}
                    >
                      {bill.buyer.phone_number}
                    </Table.Cell>
                    <Table.Cell>
                      {bill.seller.first_name} {bill.seller.last_name}
                    </Table.Cell>
                    <Table.Cell
                      style={{ fontFamily: "arial", fontWeight: "bold" }}
                    >
                      {digitToComma(bill.final_price)}&nbsp;
                      <span className="yekan">تومان</span>
                    </Table.Cell>
                    <Table.Cell style={{ fontFamily: "arial" }}>
                      {standardTimeToJalaali(bill.create_date)}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        icon="info"
                        labelPosition="right"
                        color="yellow"
                        content="مشاهده"
                        className="yekan"
                        onClick={() => {
                          history.push(`/cashregister/${bill.pk}`);
                        }}
                      />
                      <Button
                        icon="delete"
                        labelPosition="right"
                        color="red"
                        content="حذف"
                        className="yekan"
                        onClick={() => {
                          this.props
                            .deleteBill(bill.pk)
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
        ) : (
          <LoadingBar />
        )}
        {this.state.noResult && <NotFound />}
      </Table>
    );
  }
}

const mapStateToProps = state => {
  return {
    activeBills: state.cash.activeBills && state.cash.activeBills.results
  };
};

export default connect(mapStateToProps, { getActiveBills, deleteBill })(
  CashRegisterTable
);
