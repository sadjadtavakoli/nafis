import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Container,
  Segment,
  Button,
  Table,
  Pagination,
  Icon,
  Dimmer,
  Loader
} from "semantic-ui-react";
import AddBillModal from "./AddBillModal";

import BillLists from "./BillLists";
import { getAllActiveBills } from "../../actions/BillActions";
import LoadingBar from "../utils/loadingBar";
import BillDoneModal from "./BillDoneModal";
import BillDeleteModal from "./BillDeleteModal";

const CashRegister = ({ getAllActiveBills, activeBills, loading }) => {
  const [modal, setModal] = useState(false);
  const [data, setData] = useState({});
  const [billPK, setBillPK] = useState(undefined);
  const openModal = data => setModal(data);
  const closeModal = () => setModal(false);

  const [doneDialog, setDoneDialog] = useState(false);
  const closeDoneDialog = () => setDoneDialog(false);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const closeDeleteDialog = () => setDeleteDialog(false);

  useEffect(() => {
    getAllActiveBills();
  }, []);
  return (
    <Container>
      <AddBillModal
        open={modal}
        onClose={closeModal}
        data={data}
        billPK={billPK}
      />
      <BillDoneModal dialog={doneDialog} closeDialog={closeDoneDialog} />
      <BillDeleteModal dialog={deleteDialog} closeDialog={closeDeleteDialog} />
      {loading ? (
        <LoadingBar />
      ) : (
        <BillLists
          title="لیست فاکتور‌های فعال"
          headerTitles={[
            "موبایل خریدار",
            "مبلغ نهایی فاکتور",
            "تاریخ فاکتور",
            "عملیات فاکتور"
          ]}
          dataProvider={activeBills || []}
          setModal={setModal}
          setData={setData}
          setBillPK={setBillPK}
          setDoneDialog={setDoneDialog}
          setDeleteDialog={setDeleteDialog}
        />
      )}
    </Container>
  );
};

export default connect(
  state => {
    return {
      loading: state.bills.loading,
      activeBills: state.bills.bills.filter(bill => bill.status === "active")
    };
  },
  { getAllActiveBills }
)(CashRegister);
