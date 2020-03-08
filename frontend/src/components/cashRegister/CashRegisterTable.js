import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button } from "semantic-ui-react";
import { getActiveBills, deleteBill } from "../../actions/CashRegisterActions";
import { digitToComma } from "../utils/numberUtils";
import { standardTimeToJalaali, convertToJalaali } from "../utils/jalaaliUtils";
import NotFound from "../utils/notFound";
import LoadingBar from "../utils/loadingBar";
import { toastr } from "react-redux-toastr";
import history from "../../history";
import TableLabel from "../utils/tableLabelGenerator";

const CashRegisterTable = () => {
  const [fetch, setFetch] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const bills = useSelector(state => state.cash.activeBills);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getActiveBills()).then(() => {
      setFetch(true);
      console.log(bills);
    });
  }, []);

  // componentDidMount() {
  //   this.getActiveBills();
  // }

  // getActiveBills = () => {
  //   this.props.getActiveBills().then(() => {
  //     this.setState({
  //       fetch: true
  //     });
  //   });
  // };

  // closeModal = () => {
  //   this.setState({
  //     open: true
  //   });
  // };

  return (
    <React.Fragment>
      {fetch && bills.length ? (
        <Table celled className="rtl text-center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="5" className="text-right">
                لیست فاکتورهای فعال
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <React.Fragment>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="table-border-left">
                  <TableLabel>1</TableLabel>
                  موبایل خریدار
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>2</TableLabel>
                  اسم فروشنده
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>3</TableLabel>
                  مبلغ نهایی فاکتور
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>4</TableLabel>
                  تاریخ فاکتور
                </Table.HeaderCell>
                <Table.HeaderCell>عملیات فاکتور</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {bills.map(bill => {
                return (
                  <Table.Row>
                    <Table.Cell
                      className="table-border-left"
                      style={{ fontFamily: "arial" }}
                    >
                      <TableLabel>1</TableLabel>
                      {bill.buyer.phone_number}
                    </Table.Cell>
                    <Table.Cell>
                      <TableLabel>2</TableLabel>
                      {bill.seller.first_name} {bill.seller.last_name}
                    </Table.Cell>
                    <Table.Cell
                      style={{ fontFamily: "arial", fontWeight: "bold" }}
                    >
                      <TableLabel>3</TableLabel>
                      {digitToComma(bill.final_price)}&nbsp;
                      <span className="yekan">تومان</span>
                    </Table.Cell>
                    <Table.Cell style={{ fontFamily: "arial" }}>
                      <TableLabel>4</TableLabel>
                      {standardTimeToJalaali(
                        convertToJalaali(bill.create_date)
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        icon="info"
                        labelPosition="right"
                        color="teal"
                        content="مشاهده"
                        className="yekan"
                        onClick={() => {
                          history.push(`/cashregister/${bill.pk}`);
                        }}
                      />
                      <Button
                        icon="delete"
                        labelPosition="right"
                        color="redلیست فاکتورهای ف"
                        content="حذف"
                        className="yekan"
                        LoadingBar
                        onClick={() => {
                          deleteBill(bill.pk)
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
        </Table>
      ) : null}
      {!fetch ? <LoadingBar /> : null}
      {fetch && !bills.length ? <NotFound /> : null}
    </React.Fragment>
  );
};

// const mapStateToProps = state => {
//   return {
//     activeBills: state.cash.activeBills && state.cash.activeBills.results
//   };
// };

export default CashRegisterTable;
