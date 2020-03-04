import React, { useState, useEffect } from "react";
import { Table, Grid, Search, Button } from "semantic-ui-react";
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
      <Table celled className="text-center">
        <Table.Header className="text-right">
          <Table.Row>
            <Table.HeaderCell colSpan="9">
              <Grid>
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
                <Grid.Column width={13}>
                  <Search
                    placeholder="جست و جو..."
                    className="placeholder-rtl yekan"
                    id="text-right"
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
                <Table.HeaderCell>عملیات</Table.HeaderCell>
                <Table.HeaderCell>
                  حالت فاکتور (تسویه یا عدم تسویه)
                </Table.HeaderCell>
                <Table.HeaderCell>تاریخ خرید</Table.HeaderCell>
                <Table.HeaderCell>تاریخ ثبت فاکتور در سیستم</Table.HeaderCell>
                <Table.HeaderCell>
                  تعداد اجناس ثبت شده در فاکتور
                </Table.HeaderCell>
                <Table.HeaderCell>خلاصه اجناس</Table.HeaderCell>
                <Table.HeaderCell>شماره فاکتور</Table.HeaderCell>
                <Table.HeaderCell>ردیف</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {factors.results.map((factor, index) => {
                return (
                  <Table.Row>
                    <Table.Cell>
                      <Grid>
                        <Grid.Row columns={2}>
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
                        </Grid.Row>
                      </Grid>
                    </Table.Cell>
                    <Table.Cell>
                      {factor.status === "remained" ? "عدم تسویه" : "تسویه"}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      {standardTimeToJalaali(factor.create_date)}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      {standardTimeToJalaali(factor.create_date)}
                    </Table.Cell>
                    <Table.Cell id="norm-latin">
                      {factor.items.length}
                    </Table.Cell>
                    <Table.Cell>
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
                    <Table.Cell id="norm-latin">{factor.pk}</Table.Cell>
                    <Table.Cell id="norm-latin">{index + 1}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </React.Fragment>
        ) : null}
        {!fetch ? <LoadingBar /> : null}
        {fetch && !factors.count ? <NotFound /> : null}
      </Table>

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
