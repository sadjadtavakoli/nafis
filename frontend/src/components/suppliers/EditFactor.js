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
  Popup,
  Form,
  Header
} from "semantic-ui-react";
import BackButton from "../utils/BackButton";
import { useSelector, useDispatch } from "react-redux";
import {
  getSupplierFactor,
  deleteFactorItem
} from "../../actions/SuppliersActions";
import { digitToComma, enToFa } from "../utils/numberUtils";
import { toastr } from "react-redux-toastr";

const EditFactor = () => {
  const [fetch, setFetch] = useState(false);
  const [currencyReadOnly, setCurrencyReadOnly] = useState(true);
  const [count, setCount] = useState(0);

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
      setFetch(true);
    });
  }, []);

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
                pinned
                content={
                  <Card>
                    <Card.Header>
                      <Header className="text-right">افزودن آیتم جدید</Header>
                    </Card.Header>
                    <Card.Content>
                      <Form>
                        <Form.Input />
                      </Form>
                    </Card.Content>
                  </Card>
                }
                on="click"
                position="top center"
                trigger={<Button circular icon="add" color="green" />}
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
                  <Table.Cell>
                    {enToFa(digitToComma(item.product.selling_price))}
                  </Table.Cell>
                  <Table.Cell>
                    {enToFa(
                      digitToComma(
                        Number(item.product.buying_price) * Number(item.amount)
                      )
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {enToFa(digitToComma(item.product.buying_price))}
                  </Table.Cell>
                  <Table.Cell>{enToFa(item.product.stock_amount)}</Table.Cell>
                  <Table.Cell>{enToFa(item.amount)}</Table.Cell>
                  <Table.Cell>{item.product.name}</Table.Cell>
                  <Table.Cell>{enToFa(item.product.code)}</Table.Cell>
                  <Table.Cell>{enToFa(index + 1)}</Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </Container>
  );
};

export default EditFactor;
