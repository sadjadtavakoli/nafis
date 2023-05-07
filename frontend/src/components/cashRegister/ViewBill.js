import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Segment,
  Grid,
  Table,
  Button,
  Checkbox,
  Modal,
  Header,
  Input,
  Label
} from "semantic-ui-react";
import {
  getOneBill,
  deletePayment,
  doneTheBill
} from "../../actions/CashRegisterActions";
import { getClassTypes } from "../../actions/CustomersActions";
import LoadingBar from "../utils/loadingBar";
import TableLabel from "../utils/tableLabelGenerator";
import AddPaymentModal from "./AddPaymentModal";
import { digitToComma } from "../utils/numberUtils";
import EditCustomerModal from "./EditCustomerModal";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import logo from "../../assets/logo_printable.png";
import { toastr } from "react-redux-toastr";
import history from "../../history";
import { deleteItem, updateBill } from "../../actions/SaleActions";
import NotFound from "../utils/notFound";
const ViewBillModal = () => {
  var messagesEnd;
  const userData = JSON.parse(localStorage.getItem("user"));
  const [classType, setClassType] = useState(null);
  const [fetch, setFetch] = useState(false);
  const [openAddPayment, setOpenAddPayment] = useState(false);
  const [openEditCustomer, setOpenEditCustomer] = useState(false);
  const [open, setOpen] = useState(false);
  const [editPoints, setEditPoints] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [usedPoints, setUsedPoints] = useState(0);

  const pk = window.location.pathname.split("/")[2];

  const bill = useSelector(state => state.cash.theBill);
  const dispatch = useDispatch();

  useEffect(() => {
    getBill();
  }, [fetch]);

  const getBill = () => {
    dispatch(getOneBill(pk)).then(() => {
      dispatch(getClassTypes()).then(res => {
        let customerTypes = res.data.customerTypes;
        customerTypes.map(classTypeItem => {
          if (bill && classTypeItem.value === bill.buyer.class_type)
            setClassType(classTypeItem.text);
        });
      });

      setFetch(true);
      setUsedPoints(bill && bill.used_points);
      // scrollToBottom();
    });
  };

  const toggleAddPaymentModal = () => setOpenAddPayment(!openAddPayment);

  const toggleEditCustomerModal = () => {
    setOpenEditCustomer(!openEditCustomer);
    getBill();
  };

  const deleteItemFunc = pk => {
    let confirm = window.confirm("آیا از حذف این قلم مطمئن هستید؟");
    if (confirm) {
      dispatch(deleteItem(pk))
        .then(() => {
          toastr.success("قلم با موفقیت حذف شد");
          getBill();
        })
        .catch(() => {
          toastr.error("خطا در حذف قلم");
        });
    }
  };
  const deletePaymentFunc = pk => {
    let confirm = window.confirm("آیا از حذف این پرداخت مطمئن هستید؟");
    if (confirm) {
      dispatch(deletePayment(pk))
        .then(() => {
          toastr.success("پرداخت با موفقیت حذف شد");
          getBill();
        })
        .catch(() => {
          toastr.error("خطا در حذف پرداختی");
        });
    }
  };

  const closeModal = () => setOpen(false);

  const handleSubmit = pk => {
    let sms = toggle;
    dispatch(doneTheBill(pk, sms)).then(() => {
      history.push(`/factor/${pk}/print`);
    });
  };

  const handlePointsChange = e => setUsedPoints(e.target.value);

  const handleEditClick = () => setEditPoints(true);

  const handleEditSubmit = pk => {
    updateBill(pk, { usedPoints: Number(usedPoints) })
      .then(() => {
        setEditPoints(false);
        getBill();
        toastr.success("امتیاز با موفقیت اعمال شد");
      })
      .catch(() => {
        toastr.error("امتیاز استفاده شده بیشتر از حد مجاز است");
      });
  };
  const scrollToBottom = () => {
    messagesEnd.scrollIntoView({ behavior: "smooth" });
  };
  const handleToggleChange = () => setToggle(!toggle);

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

      {fetch ? (
        <Segment.Group className="rtl" style={{ padding: "10px" }}>
          <Grid>
            <Grid.Column floated="right" width={14}>
              <Segment.Group horizontal>
                <Table className="text-right">
                  <Table.Body>
                    <Table.Row colSpan={3}>
                      <Table.Cell>
                        <span style={{ fontWeight: "bold" }}>
                          شماره فاکتور:
                        </span>
                        &nbsp;
                        <span id="norm-latin">{bill.pk}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span style={{ fontWeight: "bold" }}>فروشنده:</span>
                        &nbsp;
                        <span>
                          {bill.seller.first_name}&nbsp;
                          {bill.seller.last_name}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span style={{ fontWeight: "bold" }}>صندوق دار:</span>
                        &nbsp;
                        <span>
                          {userData.first_name + " " + userData.last_name}
                        </span>
                      </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>
                        <span style={{ fontWeight: "bold" }}>نام مشتری:</span>
                        &nbsp;
                        <span>
                          {bill.buyer.first_name}&nbsp;
                          {bill.buyer.last_name}
                        </span>
                        <Button
                          size="mini"
                          className="yekan"
                          color="teal"
                          labelPosition="right"
                          icon="edit"
                          content="ویرایش مشتری"
                          onClick={() => toggleEditCustomerModal()}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <span style={{ fontWeight: "bold" }}>امتیاز:</span>
                        &nbsp;
                        <span id="norm-latin">{bill.buyer.points}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span style={{ fontWeight: "bold" }}>شماره همراه:</span>
                        &nbsp;
                        <span id="norm-latin">{bill.buyer.phone_number}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span style={{ fontWeight: "bold" }}>نوع مشتری:</span>
                        &nbsp;
                        <span>{classType}</span>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Segment.Group>
            </Grid.Column>
            <Grid.Column
              floated="left"
              className={"only-desktop"}
              width={2}
              style={{ paddingRight: 0 }}
            >
              <img src={logo} className="nafis-logo" />
            </Grid.Column>
          </Grid>
          <Table celled className="rtl text-center">
            {bill.items.length ? (
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="table-border-left">
                    <TableLabel count={1}>ردیف</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel count={2}>شرح کالا</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel count={3}>کد کالا</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel count={4}>متراژ</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel count={5}>مبلغ واحد</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel count={6}>تخفیف</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel count={7}>مبلغ خام</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel count={8}>مبلغ نهایی</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel count={9}>ته طاقه</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="table-border-left-none">
                    عملیات
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            ) : (
              <NotFound
                header="لیست اقلام در این فاکتور موجود نمی باشد"
                content=" "
              />
            )}

            <Table.Body>
              {bill.items.map((item, index) => {
                return (
                  <Table.Row>
                    <Table.Cell className="table-border-left" id="norm-latin">
                      <TableLabel count={1}>{index + 1}</TableLabel>
                    </Table.Cell>
                    <Table.Cell>
                      <TableLabel count={2}>{item.product.name}</TableLabel>
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel count={3}>{item.product.code}</TableLabel>
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel count={4}>
                        {item.end_of_roll_amount > 0
                          ? item.end_of_roll_amount
                          : item.amount}
                      </TableLabel>
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel count={5}>
                        {digitToComma(item.product.selling_price)}
                      </TableLabel>
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel count={6}>
                        {digitToComma(item.discount)}
                      </TableLabel>
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel count={7}>
                        {digitToComma(item.price)}
                      </TableLabel>
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel count={8}>
                        {digitToComma(item.final_price)}
                      </TableLabel>
                    </Table.Cell>
                    <Table.Cell>
                      <TableLabel count={9}>
                        <Checkbox toggle readOnly checked={item.end_of_roll} />
                      </TableLabel>
                    </Table.Cell>
                    <Table.Cell className="table-border-left-none">
                      <Button
                        color="red"
                        className="yekan"
                        icon="trash"
                        labelPosition="right"
                        content="حذف قلم"
                        size="mini"
                        onClick={() => deleteItemFunc(item.pk)}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          <Grid reversed celled className={"ltr"}>
            <Grid.Row>
              <Grid.Column className={"norm-latin text-right"} width={13}>
                <span>{digitToComma(bill.price)}</span>
              </Grid.Column>
              <Grid.Column width={3} className={"bg-table"}>
                مبلغ خام
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column className={"norm-latin text-right"} width={13}>
                <span>{digitToComma(bill.items_discount)}</span>
              </Grid.Column>
              <Grid.Column width={3} className={"bg-table"}>
                مجموع تخفیف کالایی
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column className={"norm-latin text-right"} width={13}>
                <span>{digitToComma(bill.discount)}</span>
              </Grid.Column>
              <Grid.Column width={3} className={"bg-table"}>
                تخفیف روی کل فاکتور
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column className={"norm-latin text-right"} width={13}>
                <Input
                  value={usedPoints}
                  onChange={e => handlePointsChange(e)}
                  readOnly={editPoints ? false : true}
                  type="number"
                  className="ltr"
                />
              </Grid.Column>
              <Grid.Column width={3} className={"bg-table"}>
                <Label
                  color={editPoints ? "green" : "teal"}
                  style={{ marginRight: "5px" }}
                  className="pointer"
                  onClick={
                    !editPoints
                      ? handleEditClick
                      : () => handleEditSubmit(bill.pk)
                  }
                >
                  {editPoints ? "اعمال" : "ویرایش"}
                </Label>
                <span>امتیاز</span>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column className={"norm-latin text-right"} width={13}>
                <span>
                  {digitToComma(
                    Number(bill.remaining_payment) - Number(usedPoints)
                  )}
                </span>
              </Grid.Column>
              <Grid.Column width={3} className={"bg-table"}>
                مبلغ قابل پرداخت
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <hr color="#ddd" />

          {bill && !!bill.payments.length && (
            <Table celled className="rtl text-center">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="4" className="text-right">
                    پرداخت ها
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="table-border-left">
                    <TableLabel count={1}>تاریخ ایجاد</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel count={2}>مبلغ پرداختی</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel count={3}>نوع پرداخت</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="table-border-left-none">
                    عملیات
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {bill.payments.map(payment => {
                  return (
                    <Table.Row>
                      <Table.Cell className="table-border-left" id="norm-latin">
                        <TableLabel count={1}>
                          {standardTimeToJalaali(payment.create_date)}
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell id="norm-latin">
                        <TableLabel count={2}>
                          {digitToComma(payment.amount)}
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell>
                        <TableLabel count={3}>
                          {payment.type === "card" ? "کارت" : null}
                          {payment.type === "cash" ? "نقد" : null}
                          {payment.type === "cheque" ? "چک" : null}
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="table-border-left-none">
                        <Button
                          color="red"
                          className="yekan"
                          icon="trash"
                          labelPosition="right"
                          content="حذف"
                          size="mini"
                          onClick={() => deletePaymentFunc(payment.pk)}
                        />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          )}

          <div className="text-right padded">
            <Button
              content="تایید فاکتور"
              labelPosition="right"
              className="yekan"
              onClick={() => setOpen(true)}
              size="large"
              color="green"
              icon="check"
            />
            <Button
              content="افزودن پرداخت"
              labelPosition="right"
              className="yekan"
              onClick={() => toggleAddPaymentModal()}
              color="teal"
              size="large"
              icon="add"
              disabled={
                Number(bill.remaining_payment) - Number(usedPoints) === 0
                  ? true
                  : false
              }
            />
            <Button
              content="بازگشت"
              labelPosition="right"
              className="yekan"
              onClick={() => window.history.back()}
              size="large"
              icon="arrow left"
            />
          </div>

          <Modal dimmer={"blurring"} open={open} onClose={closeModal}>
            <Modal.Header className="yekan text-right">
              بستن فاکتور
            </Modal.Header>
            <Modal.Content className="rtl text-right">
              <Header className="yekan text-right">
                آیا از بستن این فاکتور اطمینان دارید؟
              </Header>
              <div style={{ display: "inline-flex" }}>
                <span className="rtl text-right" style={{ fontSize: "17px" }}>
                  ارسال
                </span>
                &nbsp;
                <span id="norm-latin" style={{ fontSize: "17px" }}>
                  sms
                </span>
                &nbsp; &nbsp; &nbsp;
                <Checkbox
                  className="text-right rtl"
                  toggle
                  onChange={handleToggleChange}
                />
              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button color="black" onClick={closeModal} className="yekan">
                انصراف
              </Button>
              <Button
                positive
                icon="checkmark"
                labelPosition="right"
                content="بستن فاکتور"
                onClick={() => handleSubmit(bill.pk)}
                className="yekan"
              />
            </Modal.Actions>
          </Modal>

          {openAddPayment && (
            <AddPaymentModal
              scrollToBottom={scrollToBottom}
              open={openAddPayment}
              onClose={toggleAddPaymentModal}
              price={Number(bill.remaining_payment) - Number(usedPoints)}
              pk={bill.pk}
              refetch={getBill}
            />
          )}
          {openEditCustomer && (
            <EditCustomerModal
              open={openEditCustomer}
              onClose={toggleEditCustomerModal}
              pk={bill.buyer.pk}
              madeChange={getBill}
            />
          )}
        </Segment.Group>
      ) : (
        <LoadingBar />
      )}
      <div
        style={{ float: "left", clear: "both" }}
        ref={el => {
          messagesEnd = el;
        }}
      ></div>
    </Container>
  );
};

export default ViewBillModal;
