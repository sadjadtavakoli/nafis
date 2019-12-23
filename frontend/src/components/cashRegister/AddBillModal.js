import React from "react";
import {
  Button,
  Modal,
  Divider,
  Icon,
  Segment,
  Form,
  Header,
  Label
} from "semantic-ui-react";
import BuyerDetails from "./BuyerDetails";
import SellerDetails from "./SellerDetails";
import BranchDetails from "./BranchDetails";
import BillDetails from "./BillDetails";
import PaymenDetails from "./PaymentDetails";
import ProductItems from "./ProductItems";
import { connect } from "react-redux";
import { priceToPersian, enToFa } from "../utils/numberUtils";

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
      <Modal.Header className="yekan">
        <Header as="h2">مشخصات فاکتور</Header>
        <Label color="green" size="medium" className="rtl yekan">
          {console.log(props.data)}
          مبلغ نهایی:{" "}
          {props.data && enToFa(priceToPersian(props.data.final_price))} - مبلغ
          باقی‌مانده:{" "}
          {props.data && enToFa(priceToPersian(props.data.remaining_payment))}
        </Label>
      </Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Form>
            <Segment>
              <BuyerDetails buyer={props.data && props.data.buyer} />
              <Divider clearing />
              <SellerDetails seller={props.data && props.data.seller} />
              <Divider clearing />
              <ProductItems items={props.data && props.data.items} />
              <Divider clearing />
              <BranchDetails branch={props.data && !!props.data.branch} />
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
        <Button
          onClick={() => {
            props.onClose();
            props.setDoneDialog(props.data.pk);
          }}
          icon
          labelPosition="right"
          color="yellow"
        >
          <span className="yekan">تایید نهایی</span>
          <Icon name="lock" />
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default connect(
  (state, onwProps) => ({
    data: state.bills.bills.find(bill => bill.pk === onwProps.billPK)
  }),
  null
)(AddBillModal);
