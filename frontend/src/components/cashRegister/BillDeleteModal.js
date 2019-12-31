import React from "react";
import { Segment } from "semantic-ui-react";
import DialogModal from "./DialogModal";
import { connect } from "react-redux";
import { removeBill } from "../../actions/BillActions";
import { toastr } from "react-redux-toastr";

const BillDeleteModal = props => {
  const deleteBill = () => {
    props
      .removeBill(props.dialog)
      .then(() => {
        props.closeDialog();
        toastr.success("فاکتور حذف گردید");
      })
      .catch(err => {
        props.closeDialog();
        toastr.error(err.detail);
      });
  };

  return (
    <DialogModal
      open={props.dialog}
      onClose={props.closeDialog}
      title="حذف فاکتور"
      onSubmit={deleteBill}
      submitText="حذف فاکتور"
    >
      <Segment>
        <h3 className="yekan">آیا از حذف این فاکتور اطمینان دارید؟</h3>
      </Segment>
    </DialogModal>
  );
};

export default connect(null, { removeBill })(BillDeleteModal);
