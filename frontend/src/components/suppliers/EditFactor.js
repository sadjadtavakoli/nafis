import React, { useState, useEffect } from "react";
import {
  Container,
  Segment,
  Grid,
  Table,
  Button,
  Card,
  Input,
  Dropdown,
  Popup
} from "semantic-ui-react";
import BackButton from "../utils/BackButton";
import { useSelector, useDispatch } from "react-redux";
import {
  getSupplierFactor,
  deleteFactorItem,
  addFactorItem,
  deletePayment
} from "../../actions/SuppliersActions";
import { digitToComma } from "../utils/numberUtils";
import { toastr } from "react-redux-toastr";
import NotFound from "../utils/notFound";
import AddFactorItem from "./AddFactorItem";
import AddPaymentModal from "../cashRegister/AddPaymentModal";
import TableLabel from "../utils/tableLabelGenerator";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";

const EditFactor = () => {
  const [fetch, setFetch] = useState(false);
  const [currencyReadOnly, setCurrencyReadOnly] = useState(true);
  const [count, setCount] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  let [totalPrice, setTotalPrice] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [pays, setPays] = useState(false);

  const pk = Number(window.location.href.split("/")[4]);

  const currencyOptions = [
    { text: "ریال", value: "ریال" },
    { text: "دلار", value: "دلار" },
    { text: "روپیه", value: "روپیه" },
    { text: "درهم", value: "درهم" },
    { text: "یوان", value: "یوان" }
  ];

  const factor = useSelector(state => state.suppliers.factor);
  const dispatch = useDispatch();

  const deleteItem = pk => {
    let confirm = window.confirm("آیا از حذف این آیتم مطمئن هستید؟");
    if (confirm) {
      dispatch(deleteFactorItem(pk))
        .then(() => {
          setCount(count + 1);
          toastr.success("آیتم با موفقیت حذف شد");
        })
        .catch(() => toastr.error("خطا در عملیات حذف آیتم"));
    }
  };

  useEffect(() => {
    dispatch(getSupplierFactor(pk)).then(() => {
      setPays(factor && factor.payments.length ? true : false);
      setFetch(true);
    });
    console.log("get");
  }, [count]);

  const addCount = () => setCount(count + 1);

  const togglePopupOpen = () => {
    setPopupOpen(!popupOpen);
  };

  const onSubmit = data => {
    dispatch(addFactorItem(data))
      .then(() => {
        setCount(count + 1);
        toastr.success("آیتم جدید با موفقیت ثبت شد");
      })
      .catch(() => {
        toastr.error("خطا در عملیات اضافه کردن آیتم");
      });
  };

  useEffect(() => {
    fetch && console.log(factor);
    fetch &&
      factor.items.map(item => {
        let i = Number(item.product.buying_price) * Number(item.amount);
        setTotalPrice((totalPrice += i));
      });
  }, [fetch]);

  const closeModal = () => {
    setOpenModal(false);
  };

  const deletePaymentFunc = () => {
    dispatch(deletePayment(pk))
      .then(() => {
        toastr.success(
          "عملیات حذف با موفقیت انجام شد",
          "پرداختی جدید با موفقیت اضافه شد"
        );
        addCount();
      })
      .catch(() =>
        toastr.error(
          "خطا در فرایند عملیات حذف پرداختی",
          "پس از بررسی مجدد دوباره در امتحان کنید"
        )
      );
  };

  return (
    <Container>
      <Segment stacked className="rtl">
        <Grid>
          <Grid.Column verticalAlign="middle" width={5}>
            <h2 className="yekan s-h2-padding">تامین کنندگان</h2>
          </Grid.Column>
          <Grid.Column verticalAlign="middle" floated="left">
            <BackButton />
          </Grid.Column>
        </Grid>
      </Segment>
      <Table celled className="text-center">
        <Table.Header className="text-right">
          <Table.Row>
            <Table.HeaderCell colSpan="13">
              <Grid>
                <Grid.Column width={3} verticalAlign="middle">
                  <Button
                    content="ثبت عکس فاکتور"
                    className="yekan"
                    color="green"
                    labelPosition="right"
                    icon="add"
                  />
                </Grid.Column>
                <Grid.Column width={4} floated="right">
                  <Card className="yekan rtl">
                    <Card.Content>
                      <Grid>
                        <Grid.Column width={8}>
                          نوع ارز:&nbsp;&nbsp;&nbsp;
                          <Dropdown
                            defaultValue={"ریال"}
                            options={currencyOptions}
                            disabled={currencyReadOnly}
                          />
                        </Grid.Column>
                        <Grid.Column width={8}>
                          {currencyReadOnly ? (
                            <Button
                              content="ویرایش"
                              size="mini"
                              className="yekan"
                              labelPosition="right"
                              color="teal"
                              icon="edit"
                              onClick={() => setCurrencyReadOnly(false)}
                            />
                          ) : (
                            <Button
                              content="اعمال"
                              size="mini"
                              className="yekan"
                              labelPosition="right"
                              color="green"
                              icon="edit"
                              onClick={() => setCurrencyReadOnly(true)}
                            />
                          )}
                        </Grid.Column>
                      </Grid>
                    </Card.Content>
                    <Card.Content>
                      نرخ برابری:&nbsp;&nbsp;&nbsp;
                      <Input
                        size="mini"
                        defaultValue="0"
                        readOnly={currencyReadOnly}
                      />
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>عملیات</Table.HeaderCell>
            <Table.HeaderCell>رنگ طرح</Table.HeaderCell>
            <Table.HeaderCell>رنگ زمینه</Table.HeaderCell>
            <Table.HeaderCell>جنس</Table.HeaderCell>
            <Table.HeaderCell>نوع طرح</Table.HeaderCell>
            <Table.HeaderCell>قیمت فروش</Table.HeaderCell>
            <Table.HeaderCell>جمع کل</Table.HeaderCell>
            <Table.HeaderCell>قیمت خرید</Table.HeaderCell>
            <Table.HeaderCell>متراژ باقی مانده</Table.HeaderCell>
            <Table.HeaderCell>متراژ خرید</Table.HeaderCell>
            <Table.HeaderCell>نام جنس</Table.HeaderCell>
            <Table.HeaderCell>کد جنس</Table.HeaderCell>
            <Table.HeaderCell>
              <Popup
                wide="very"
                content={
                  <AddFactorItem
                    onClose={togglePopupOpen}
                    onSubmit={onSubmit}
                    pk={pk}
                  />
                }
                position="top center"
                open={popupOpen}
                trigger={
                  <Button
                    circular
                    icon="add"
                    color="green"
                    onClick={togglePopupOpen}
                  />
                }
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fetch &&
            factor.items.map((item, index) => {
              return (
                <Table.Row>
                  <Table.Cell>
                    <Button
                      content="حذف"
                      color="red"
                      size="mini"
                      className="yekan"
                      onClick={() => deleteItem(item.pk)}
                      icon="trash"
                      labelPosition="right"
                    />
                  </Table.Cell>
                  <Table.Cell>{item.product.design_color.name}</Table.Cell>
                  <Table.Cell>{item.product.background_color.name}</Table.Cell>
                  <Table.Cell>{item.product.material.name}</Table.Cell>
                  <Table.Cell>{item.product.f_type.name}</Table.Cell>
                  <Table.Cell id="norm-latin">
                    {digitToComma(item.product.selling_price)}
                  </Table.Cell>
                  <Table.Cell id="norm-latin">
                    {digitToComma(
                      Number(item.product.buying_price) * Number(item.amount)
                    )}
                  </Table.Cell>
                  <Table.Cell id="norm-latin">
                    {digitToComma(item.product.buying_price)}
                  </Table.Cell>
                  <Table.Cell id="norm-latin">
                    {item.product.stock_amount}
                  </Table.Cell>
                  <Table.Cell id="norm-latin">{item.amount}</Table.Cell>
                  <Table.Cell id="norm-latin">{item.product.name}</Table.Cell>
                  <Table.Cell id="norm-latin">{item.product.code}</Table.Cell>
                  <Table.Cell id="norm-latin">{index + 1}</Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
      <Grid>
        <Grid.Column floated="right" width="3">
          <Table
            celled
            className="text-right"
            collapsing
            style={{ minWidth: "200px" }}
          >
            <Table.Header>
              <Table.Row>
                <Table.Cell id="norm-latin">{totalPrice}</Table.Cell>
                <Table.HeaderCell>جمع کل</Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.Cell id="norm-latin">-</Table.Cell>
                <Table.HeaderCell>تخفیف</Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.Cell id="norm-latin">{totalPrice}</Table.Cell>
                <Table.HeaderCell>قابل پرداخت</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          </Table>
        </Grid.Column>
        <Grid.Column></Grid.Column>
      </Grid>
      &nbsp;
      <hr color="#ddd" />
      {pays && (
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
                <TableLabel>1</TableLabel>
                تاریخ ایجاد
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>2</TableLabel>
                مبلغ پرداختی
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>3</TableLabel>
                نوع پرداخت
              </Table.HeaderCell>
              <Table.HeaderCell className="table-border-left-none">
                عملیات
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {factor.payments.map(payment => {
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
                    {payment.type === "card" ? "کارت" : null}
                    {payment.type === "cash" ? "نقد" : null}
                    {payment.type === "cheque" ? "چک" : null}
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
      <div className="text-center padded">
        <Button
          circular
          size="huge"
          icon="arrow left"
          onClick={() => window.history.back()}
        />
        <Button
          circular
          size="huge"
          icon="plus"
          color="teal"
          onClick={() => setOpenModal(true)}
        />
        <Button circular size="huge" icon="check" color="green" />
      </div>
      {openModal && (
        <AddPaymentModal
          open={openModal}
          onClose={closeModal}
          editFactor={true}
          pk={pk}
          refetch={addCount}
        />
      )}
      {fetch && !factor.items.length ? <NotFound /> : null}
    </Container>
  );
};

export default EditFactor;
