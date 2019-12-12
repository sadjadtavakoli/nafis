import React, { useEffect, useState } from "react";
import { Segment, Checkbox } from "semantic-ui-react";
import DialogModal from "./DialogModal";
import { useToggle } from "../../utils/Hooks";
import { connect } from "react-redux";
import { doneTheBill, getBillREQUEST } from "../../actions/BillActions";
import { toastr } from "react-redux-toastr";
import { Redirect } from "react-router-dom";

const BillDoneModal = props => {
  const [fetchBillInfo, setFetchBillInfo] = useState(undefined);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (Number(props.dialog))
      props.getBillREQUEST(props.dialog).then(res => setFetchBillInfo(res));
  }, [props.dialog]);

  const [checked, toggleChecked] = useToggle(false);
  const changeToDone = () => {
    props.doneTheBill(props.dialog, checked).then(res => {
      props.closeDialog();
      setTimeout(() => {
        setRedirect(true);
      }, 100);
    });
  };

  return (
    <>
      {fetchBillInfo && Number.isInteger(fetchBillInfo.pk) && redirect ? (
        <Redirect
          push
          exact
          to={{
            pathname: `/factor/${fetchBillInfo.pk}`,
            state: fetchBillInfo
          }}
        />
      ) : null}
      <DialogModal
        open={props.dialog}
        onClose={props.closeDialog}
        title="بستن فاکتور"
        onSubmit={changeToDone}
        submitText="بستن فاکتور"
        submitDisable={!fetchBillInfo}
      >
        <Segment>
          <h3 className="yekan">آیا از بستن این فاکتور اطمینان دارید؟</h3>
          <Checkbox
            toggle
            label="ارسال SMS"
            className="yekan"
            checked={checked}
            onChange={toggleChecked}
          />
        </Segment>
      </DialogModal>
    </>
  );
};

export default connect(null, { doneTheBill, getBillREQUEST })(BillDoneModal);
