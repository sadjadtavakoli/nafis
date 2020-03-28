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
      .catch(error => {
        if (error.response) {
          toastr.error("خطا در عملیات اضافه کردن آیتم", error.response.data);
        }
      });
  };

  useEffect(() => {
    fetch &&
      factor.items.map(item => {
        let i = Number(item.product.buying_price) * Number(item.amount);
        setTotalPrice((totalPrice += i));
      });
  }, [fetch]);

  const closeModal = () => {
    setOpenModal(false);
  };

  const deletePaymentFunc = pk => {
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
        <Grid stackable>
          <Grid.Column verticalAlign="middle" mobile={8} computer={5}>
            <h2 className="yekan s-h2-padding">تامین کنندگان</h2>
          </Grid.Column>
          <Grid.Column verticalAlign="middle" floated="left" computer={1}>
            <BackButton />
          </Grid.Column>
        </Grid>
      </Segment>
      <Table celled className="rtl text-center">
        <Table.Header className="text-right">
          <Table.Row>
            <Table.HeaderCell colSpan="13">
              <Grid stackable>
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
                {/* <Grid.Column width={3} verticalAlign="middle">
                  <Button
                    content="ثبت عکس فاکتور"
                    className="yekan"
                    color="green"
                    labelPosition="right"
                    icon="add"
                  />
                </Grid.Column> */}
              </Grid>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell style={{ borderLeft: "1px solid #ddd" }}>
              <TableLabel count={1}>
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
              </TableLabel>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel count={2}>کد جنس</TableLabel>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel count={3}>نام جنس</TableLabel>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel count={4}>متراژ خرید</TableLabel>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel count={5}>متراژ باقی مانده</TableLabel>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel count={6}>قیمت خرید</TableLabel>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel count={7}>جمع کل</TableLabel>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel count={8}>قیمت فروش</TableLabel>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel count={9}>نوع طرح</TableLabel>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel count={10}>جنس</TableLabel>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel count={11}>رنگ زمینه</TableLabel>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <TableLabel count={12}>رنگ طرح</TableLabel>
            </Table.HeaderCell>
            <Table.HeaderCell>عملیات</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fetch &&
            factor.items.map((item, index) => {
              return (
                <Table.Row>
                  <Table.Cell
                    className="norm-latin font-weight-bold"
                    style={{
                      borderLeft: "1px solid #ddd"
                    }}
                  >
                    <TableLabel count={1}>#{index + 1}</TableLabel>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel count={2}>{item.product.code}</TableLabel>
                  </Table.Cell>
                  <Table.Cell className="yekan">
                    <TableLabel count={3}>{item.product.name}</TableLabel>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel count={4}>{item.amount}</TableLabel>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel count={5}>
                      {item.product.stock_amount}
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel count={6}>
                      {digitToComma(item.product.buying_price)}
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel count={7}>
                      {digitToComma(
                        Number(item.product.buying_price) * Number(item.amount)
                      )}
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel count={8}>
                      {digitToComma(item.product.selling_price)}
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell>
                    <TableLabel count={9}>
                      {item.product.f_type.name}
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell>
                    <TableLabel count={10}>
                      {item.product.material.name}
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell>
                    <TableLabel count={11}>
                      {item.product.background_color.name}
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell>
                    <TableLabel count={12}>
                      {item.product.design_color.name}
                    </TableLabel>
                  </Table.Cell>
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
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
      <Grid stackable>
        <Grid.Column floated="right" width="3">
          <Table celled className="rtl text-right" collapsing>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ borderLeft: "1px solid #ddd" }}>
                  جمع کل
                </Table.HeaderCell>
                <Table.Cell id="norm-latin" style={{ borderLeft: "none" }}>
                  {digitToComma(totalPrice)} <span>تومان</span>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell style={{ borderLeft: "1px solid #ddd" }}>
                  تخفیف
                </Table.HeaderCell>
                <Table.Cell id="norm-latin" style={{ borderLeft: "none" }}>
                  -
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell style={{ borderLeft: "1px solid #ddd" }}>
                  قابل پرداخت
                </Table.HeaderCell>
                <Table.Cell id="norm-latin" style={{ borderLeft: "none" }}>
                  {digitToComma(totalPrice)} <span>تومان</span>
                </Table.Cell>
              </Table.Row>
            </Table.Header>
          </Table>
        </Grid.Column>
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
            {factor.payments.map(payment => {
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
          content="بازگشت"
          labelPosition="right"
          className="yekan"
          size="large"
          icon="arrow left"
          onClick={() => window.history.back()}
        />
        <Button
          content="افزودن پرداخت"
          labelPosition="right"
          className="yekan"
          size="large"
          icon="plus"
          color="teal"
          onClick={() => setOpenModal(true)}
        />
        <Button
          content="تایید فاکتور"
          labelPosition="right"
          className="yekan"
          size="large"
          icon="check"
          color="green"
          // onClick={() => }
        />
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
