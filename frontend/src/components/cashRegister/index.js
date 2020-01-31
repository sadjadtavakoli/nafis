import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Container, Segment, Button } from "semantic-ui-react";
import AddBillModal from "./AddBillModal";
import history from "../../history";

import BillLists from "./BillLists";
import { getAllActiveBills } from "../../actions/BillActions";
import LoadingBar from "../utils/loadingBar";
import BillDoneModal from "./BillDoneModal";
import BillDeleteModal from "./BillDeleteModal";
import { useToggle } from "../../utils/Hooks";

const CashRegister = ({
  getAllActiveBills,
  activeBills,
  loading,
  currentUser
}) => {
  const [modal, toggleModal] = useToggle(false);

  const [billPK, setBillPK] = useState(undefined);

  const [doneDialog, setDoneDialog] = useState(false);
  const closeDoneDialog = () => setDoneDialog(false);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const closeDeleteDialog = () => setDeleteDialog(false);

  useEffect(() => {
    getAllActiveBills();
  });
  return (
    <Container>
      <Segment stacked className="rtl">
        <Button className="yekan" onClick={() => history.push('/daily-report/')} color="yellow" content='مشاهده گزارش روزانه' icon='print' labelPosition='right' />
      </Segment>
      <AddBillModal
        open={modal}
        onClose={toggleModal}
        billPK={billPK}
        setDoneDialog={setDoneDialog}
      />
      <BillDoneModal dialog={doneDialog} closeDialog={closeDoneDialog} />
      <BillDeleteModal dialog={deleteDialog} closeDialog={closeDeleteDialog} />
      {loading ? (
        <LoadingBar />
      ) : (
          <BillLists
          refetch={getAllActiveBills}
          title="لیست فاکتور‌های فعال"
          headerTitles={[
            "موبایل خریدار",
            "اسم فروشنده",
            "مبلغ نهایی فاکتور",
            "تاریخ فاکتور",
            "عملیات فاکتور"
          ]}
          currentUser={currentUser}
          dataProvider={activeBills}
          togglePreviewModal={toggleModal}
          setBillPK={setBillPK}
          setDeleteDialog={setDeleteDialog}
        />
      )}
    </Container>
  );
};

export default connect(
  state => ({
    currentUser: state.auth.currentUser,
    loading: state.bills.loading,
    activeBills:
      state.bills.bills.filter(bill => bill.status === "active") || []
  }),
  { getAllActiveBills }
)(CashRegister);
