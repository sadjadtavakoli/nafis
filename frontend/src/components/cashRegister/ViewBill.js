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
  Header
} from "semantic-ui-react";
import {
  getOneBill,
  deletePayment,
  doneTheBill
} from "../../actions/CashRegisterActions";
import LoadingBar from "../utils/loadingBar";
import TableLabel from "../utils/tableLabelGenerator";
import AddPaymentModal from "./AddPaymentModal";
import { digitToComma } from "../utils/numberUtils";
import EditCustomerModal from "./EditCustomerModal";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import logo from "../../assets/logo_printable.png";
import { toastr } from "react-redux-toastr";
import history from "../../history";

const ViewBillModal = () => {
  const [fetch, setFetch] = useState(false);
  const [openAddPayment, setOpenAddPayment] = useState(false);
  const [openEditCustomer, setOpenEditCustomer] = useState(false);
  const [pays, setPays] = useState(false);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  const pk = window.location.pathname.split("/")[2];

  const bill = useSelector(state => state.cash.theBill);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOneBill(pk)).then(() => {
      setFetch(true);
      console.log(bill);
    });
  }, [fetch]);

  const toggleAddPaymentModal = () => {
    setOpenAddPayment(!openAddPayment);
  };

  const toggleEditCustomerModal = () => {
    setOpenEditCustomer(!openEditCustomer);
  };

  const deletePayment = pk => {
    let confirm = window.confirm("آیا از حذف این پرداخت مطمئن هستید؟");
    if (confirm) {
      deletePayment(pk)
        .then(() => {
          setCount(count + 1);
          toastr.success("پرداخت با موفقیت حذف شد");
        })
        .catch(() => {
          toastr.error("خطا در حذف پرداختی");
        });
    }
  };

  const closeModal = () => setOpen(false);

  const handleSubmit = pk => {
    doneTheBill(pk).then(() => {
      history.push(`/factor/${pk}/print`);
    });
  };

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
                          {window.localStorage.user.first_name}&nbsp;
                          {window.localStorage.user.last_name}
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
                          circular
                          className="yekan"
                          color="teal"
                          onClick={() => {
                            toggleEditCustomerModal();
                          }}
                        >
                          ویرایش
                        </Button>
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
                        <span style={{ fontWeight: "bold" }}>نوع:</span>
                        &nbsp;
                        <span>{bill.items[0].product.f_type.name}</span>
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
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="table-border-left">
                  <TableLabel>1</TableLabel>
                  ردیف
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>2</TableLabel>
                  شرح کالا
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>3</TableLabel>
                  کد کالا
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>4</TableLabel>
                  متراژ
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>5</TableLabel>
                  مبلغ واحد
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>6</TableLabel>
                  تخفیف
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>7</TableLabel>
                  مبلغ خام
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>8</TableLabel>
                  مبلغ نهایی
                </Table.HeaderCell>
                <Table.HeaderCell className="table-border-left-none">
                  <TableLabel>9</TableLabel>
                  ته طاقه
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {bill.items.map((item, index) => {
                return (
                  <Table.Row>
                    <Table.Cell className="table-border-left" id="norm-latin">
                      <TableLabel>1</TableLabel>
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell>
                      <TableLabel>2</TableLabel>
                      {item.product.name}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel>3</TableLabel>
                      {item.product.code}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel>4</TableLabel>
                      {item.amount}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel>5</TableLabel>
                      {digitToComma(item.product.selling_price)}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel>6</TableLabel>
                      {digitToComma(item.discount)}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel>7</TableLabel>
                      {digitToComma(item.price)}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel>8</TableLabel>
                      {digitToComma(item.final_price)}
                    </Table.Cell>
                    <Table.Cell className="table-border-left-none">
                      <TableLabel>9</TableLabel>
                      <Checkbox toggle readOnly checked={item.end_of_roll} />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          <Table celled className="rtl text-center" columns="4">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="table-border-left">
                  <TableLabel>1</TableLabel>
                  مبلغ خام
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>2</TableLabel>
                  مچموع تخفیف کالایی
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>3</TableLabel>
                  تخفیف روی کل فاکتور
                </Table.HeaderCell>
                <Table.HeaderCell className="table-border-left-none">
                  <TableLabel>4</TableLabel>
                  مبلغ قابل پرداخت
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell className="table-border-left" id="norm-latin">
                  <TableLabel>1</TableLabel>
                  {digitToComma(bill.final_price)}
                </Table.Cell>
                <Table.Cell id="norm-latin">
                  <TableLabel>2</TableLabel>
                  {digitToComma(bill.total_discount)}
                </Table.Cell>
                <Table.Cell id="norm-latin">
                  <TableLabel>3</TableLabel>
                  {digitToComma(bill.items_discount)}
                </Table.Cell>
                <Table.Cell className="table-border-left-none" id="norm-latin">
                  <TableLabel>4</TableLabel>
                  {digitToComma(bill.remaining_payment)}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <hr color="#ddd" />

          {pays && (
            <Table celled className="rtl text-center">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="4" className="text-right">
                    <TableLabel>1</TableLabel>
                    پرداخت ها
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="table-border-left">
                    <TableLabel>2</TableLabel>
                    تاریخ ایجاد
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel>3</TableLabel>
                    مبلغ پرداختی
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <TableLabel>4</TableLabel>
                    نوع پرداخت
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
                        <TableLabel>1</TableLabel>
                        {standardTimeToJalaali(payment.create_date)}
                      </Table.Cell>
                      <Table.Cell id="norm-latin">
                        <TableLabel>2</TableLabel>
                        {digitToComma(payment.amount)}
                      </Table.Cell>
                      <Table.Cell>
                        <TableLabel>3</TableLabel>
                        {payment.type === "card" ? "نقد و کارت" : "چک"}
                      </Table.Cell>
                      <Table.Cell className="table-border-left-none">
                        <Button
                          color="red"
                          className="yekan"
                          onClick={() => deletePayment(payment.pk)}
                        >
                          حذف
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          )}
          <div className="text-center padded">
            <Button
              circular
              onClick={() => setOpen(true)}
              size="huge"
              color="green"
              icon="check"
              disabled={!bill.payments.length}
            />
            <Button
              circular
              onClick={() => {
                toggleAddPaymentModal();
              }}
              color="teal"
              size="huge"
              icon="add"
            />
            <Button
              circular
              onClick={() => window.history.back()}
              size="huge"
              icon="arrow left"
            />
          </div>

          <Modal dimmer={"blurring"} open={open} onClose={closeModal}>
            <Modal.Header className="yekan text-right">
              بستن فاکتور
            </Modal.Header>
            <Modal.Content>
              <Header className="yekan text-right">
                آیا از بستن این فاکتور اطمینان دارید؟
              </Header>
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
              open={openAddPayment}
              onClose={toggleAddPaymentModal}
              price={bill.final_price}
              pk={bill.pk}
              // refetch={getBill}
            />
          )}
          {openEditCustomer && (
            <EditCustomerModal
              open={openEditCustomer}
              onClose={toggleEditCustomerModal}
              pk={bill.buyer.pk}
              // madeChange={getBill}
            />
          )}
        </Segment.Group>
      ) : (
        <LoadingBar />
      )}
    </Container>
  );
};

export default ViewBillModal;
