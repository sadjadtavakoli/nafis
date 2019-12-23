import React from "react";
import { Table, Icon, Button } from "semantic-ui-react";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import { enToFa, priceToPersian } from "../utils/numberUtils";
import NotFound from '../utils/notFound'
const BillLists = ({
  title,
  headerTitles,
  dataProvider,
  setBillPK,
  togglePreviewModal,
  setDoneDialog,
  setDeleteDialog,
  currentUser
}) => {
  return (
    <Table className="rtl">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan="10" className="rtl text-right">
            {title}
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          {Object.keys(dataProvider).length > 0 ?headerTitles.map((eachTitle, index) => (
            <Table.HeaderCell
              className="text-center"
              key={`bill_list_header_${index}`}
            >
              {eachTitle}
            </Table.HeaderCell>
          )):<NotFound/>}
        </Table.Row>
      </Table.Header>

      <Table.Body>

        {dataProvider.map((item, index) => (
          <Table.Row key={`bill_list_body_${index}`}>
            <Table.Cell className="norm-latin text-center">
              <span className="yekan">
                {item.buyer && enToFa(item.buyer.phone_number)}
              </span>
            </Table.Cell>
            <Table.Cell className="norm-latin text-center">
              <span className="yekan">
                {item.seller &&
                  `${item.seller.first_name} ${item.seller.last_name}`}
              </span>
            </Table.Cell>
            <Table.Cell className="norm-latin text-center">
              <span className="yekan">{priceToPersian(item.final_price)}</span>
            </Table.Cell>
            <Table.Cell className="norm-latin text-center">
              <span className="yekan">
                {enToFa(standardTimeToJalaali(item.create_date))}
              </span>
            </Table.Cell>
            <Table.Cell className="norm-latin text-center">
              <Button
                onClick={() => {
                  setBillPK(item.pk);
                  togglePreviewModal();
                }}
                icon
                labelPosition="right"
                color="teal"
              >
                <span className="yekan">مشاهده</span>
                <Icon name="edit" />
              </Button>

              {currentUser.job === "admin" ? (
                <Button
                  onClick={() => {
                    setDeleteDialog(item.pk);
                  }}
                  icon
                  labelPosition="right"
                  negative
                >
                  <span className="yekan">حذف</span>
                  <Icon name="close" />
                </Button>
              ) : null}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell
            colSpan="10"
            className="norm-latin"
          ></Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

export default BillLists;
