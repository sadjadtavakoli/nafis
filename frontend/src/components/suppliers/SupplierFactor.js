import React, { useState, useEffect } from "react";
import { Table, Grid, Search, Button, Tab } from "semantic-ui-react";
import AddSupplierFactorModal from "./AddSupplierFactorModal";
import { useSelector, useDispatch } from "react-redux";
import {
  getSupplierFactors,
  deleteSupplierFactor
} from "../../actions/SuppliersActions";
import LoadingBar from "../utils/loadingBar";
import NotFound from "../utils/notFound";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import { toastr } from "react-redux-toastr";
import history from "../../history";
import TableLabel from "../utils/tableLabelGenerator";

const SupplierFactor = ({ pk }) => {
  const [openModal, setOpenModal] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [count, setCount] = useState(0);

  const closeModal = () => setOpenModal(false);
  const addCount = () => {
    setCount(count + 1);
  };

  const factors = useSelector(state => state.suppliers.factors);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSupplierFactors(pk)).then(() => setFetch(true));
  }, [count]);

  const deleteFactor = pk => {
    let confirm = window.confirm("آیا از حذف این فاکتور مطمئن هستید؟");
    if (confirm)
      dispatch(deleteSupplierFactor(pk))
        .then(() => {
          setCount(count + 1);
          toastr.success("فاکتور با موفقیت حذف گردید");
        })
        .catch(() => {
          toastr.error("خطا در عملیات حذف فاکتور");
        });
  };

  return (
    <React.Fragment>
      <Table celled className="rtl text-center">
        <Table.Header className="text-right">
          <Table.Row>
            <Table.HeaderCell colSpan="9">
              <Grid stackable>
                <Grid.Column width={13}>
                  <Search
                    placeholder="جست و جو..."
                    className="placeholder-rtl yekan"
                    id="text-right"
                  />
                </Grid.Column>
                <Grid.Column width={3}>
                  <Button
                    content="ثبت فاکتور جدید"
                    className="yekan"
                    color="green"
                    labelPosition="right"
                    icon="add"
                    onClick={() => setOpenModal(true)}
                  />
                </Grid.Column>
              </Grid>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {fetch && factors.count ? (
          <React.Fragment>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ borderLeft: "1px solid #ddd" }}>
                  <TableLabel>1</TableLabel>
                  ردیف
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>2</TableLabel>شماره فاکتور
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>3</TableLabel>خلاصه اجناس
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>4</TableLabel>
                  تعداد اجناس ثبت شده در فاکتور
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>5</TableLabel>تاریخ ثبت فاکتور در سیستم
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>6</TableLabel>تاریخ خرید
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <TableLabel>7</TableLabel>
                  حالت فاکتور (تسویه یا عدم تسویه)
                </Table.HeaderCell>
                <Table.HeaderCell style={{ borderLeft: "none" }}>
                  عملیات
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {factors.results.map((factor, index) => {
                return (
                  <Table.Row>
                    <Table.Cell
                      id="norm-latin"
                      style={{ borderLeft: "1px solid #ddd" }}
                    >
                      <TableLabel>1</TableLabel>
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel>2</TableLabel>
                      {factor.pk}
                    </Table.Cell>
                    <Table.Cell>
                      <TableLabel>3</TableLabel>
                      {factor.items.length ? (
                        factor.items.length > 5 ? (
                          <React.Fragment>
                            <span>{factor.items[0].product.name}</span>
                            <br />
                            <span>{factor.items[1].product.name}</span>
                            <br />
                            <span>{factor.items[2].product.name}</span>
                            <br />
                            <span>{factor.items[3].product.name}</span>
                            <br />
                            <span>{factor.items[4].product.name}</span>
                            <br />
                            <span>...</span>
                          </React.Fragment>
                        ) : (
                          factor.items.map(item => {
                            return (
                              <span>
                                {item.product.name}
                                <br />
                              </span>
                            );
                          })
                        )
                      ) : (
                        "-"
                      )}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel>4</TableLabel>
                      {factor.items.length}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel>5</TableLabel>
                      {standardTimeToJalaali(factor.create_date)}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      <TableLabel>6</TableLabel>
                      {standardTimeToJalaali(factor.create_date)}
                    </Table.Cell>
                    <Table.Cell>
                      <TableLabel>7</TableLabel>
                      {factor.status === "remained" ? "عدم تسویه" : "تسویه"}
                    </Table.Cell>
                    <Table.Cell style={{ borderLeft: "none" }}>
                      <Grid>
                        <Grid.Row columns={2}>
                          <Grid.Column
                            style={{
                              paddingLeft: 0
                            }}
                          >
                            <Button
                              content="ویرایش"
                              color="teal"
                              className="yekan"
                              icon="edit"
                              labelPosition="right"
                              size="mini"
                              onClick={() =>
                                history.push(`/supplier/${factor.pk}/`)
                              }
                            />
                          </Grid.Column>
                          <Grid.Column
                            style={{
                              paddingRight: 0
                            }}
                          >
                            <Button
                              content="حذف"
                              color="red"
                              className="yekan"
                              icon="trash"
                              labelPosition="right"
                              size="mini"
                              onClick={() => deleteFactor(factor.pk)}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </React.Fragment>
        ) : null}
        {!fetch ? <LoadingBar /> : null}
      </Table>

      {fetch && !factors.count ? <NotFound /> : null}

      {openModal ? (
        <AddSupplierFactorModal
          open={openModal}
          onClose={closeModal}
          pk={pk}
          addCount={addCount}
        />
      ) : null}
    </React.Fragment>
  );
};

export default SupplierFactor;
