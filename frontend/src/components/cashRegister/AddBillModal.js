import React from "react";
import {
  Button,
  Modal,
  Divider,
  Header,
  Segment,
  Form,
  Card,
  Popup,
  Icon,
  Message,
  Label
} from "semantic-ui-react";
import BuyerDetails from "./BuyerDetails";
import SellerDetails from "./SellerDetails";
import BranchDetails from "./BranchDetails";
import BillDetails from "./BillDetails";
import PaymenDetails from "./PaymentDetails";
import ProductItems from "./ProductItems";
import { connect } from "react-redux";

const AddBillModal = props => {
  const [isOpenAddItem, setIsOpenAddItem] = React.useState(false);
  const toggleAddItemPopup = () => {
    setIsOpenAddItem(prevState => !prevState);
  };
  return (
    <Modal
      id="add-bill"
      closeOnDimmerClick={false}
      dimmer="blurring"
      className="text-right rtl yekan"
      open={props.open}
      onClose={props.onClose}
    >
      <Modal.Header className="yekan">مشخصات فاکتور</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Form>
            <Segment>
              <BuyerDetails
                buyer={props.data && props.data.buyer}
                editable={false}
              />
              <Divider clearing />
              <SellerDetails
                seller={props.data && props.data.seller}
                editable={false}
              />
              <Divider clearing />
              <ProductItems items={props.data && props.data.items} />
              <Divider clearing />
              <BranchDetails
                branch={props.data && props.data.branch}
                editable={false}
              />
              <Divider clearing />
              <BillDetails bill={props.data} />

              <Divider clearing />
              <PaymenDetails
                payments={(props.data && props.data.payments) || []}
                data={props.data}
                billPK={props.billPK}
                toggleAddItemPopup={toggleAddItemPopup}
                isOpenAddItem={isOpenAddItem}
              />
            </Segment>
          </Form>
        </Modal.Description>
      </Modal.Content>

      <Modal.Actions>
        <Button
          color="black"
          onClick={() => {
            setIsOpenAddItem(false);
            props.onClose();
          }}
        >
          <span>بستن پنجره</span>
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
export default connect((state, onwProps) => {
  const da = state.bills.bills.find(bill => bill.pk === onwProps.billPK);
  return {
    data: da
  };
}, null)(AddBillModal);
