import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";
import AddBillModal from "./AddBillModal";

import BillLists from "./BillLists";
import { getAllActiveBills } from "../../actions/BillActions";
import LoadingBar from "../utils/loadingBar";
import BillDoneModal from "./BillDoneModal";
import BillDeleteModal from "./BillDeleteModal";
import { useToggle } from "../../utils/Hooks";

const CashRegister = ({ getAllActiveBills, activeBills, loading }) => {
  const [modal, toggleModal] = useToggle(false);

  const [billPK, setBillPK] = useState(undefined);

  const [doneDialog, setDoneDialog] = useState(false);
  const closeDoneDialog = () => setDoneDialog(false);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const closeDeleteDialog = () => setDeleteDialog(false);

  useEffect(() => {
    getAllActiveBills();
  }, []);
  return (
    <Container>
      <AddBillModal open={modal} onClose={toggleModal} billPK={billPK} />
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
          dataProvider={activeBills}
          togglePreviewModal={toggleModal}
          setBillPK={setBillPK}
          setDoneDialog={setDoneDialog}
          setDeleteDialog={setDeleteDialog}
        />
      )}
    </Container>
  );
};

export default connect(
  state => ({
    loading: state.bills.loading,
    activeBills:
      state.bills.bills.filter(bill => bill.status === "active") || []
  }),
  { getAllActiveBills }
)(CashRegister);