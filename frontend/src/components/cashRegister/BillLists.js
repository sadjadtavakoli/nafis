import React from "react";
import { Table, Pagination, Icon, Button } from "semantic-ui-react";
import { standardTimeToJalaali } from "../utils/jalaaliUtils";
import { enToFa, priceToPersian } from "../utils/numberUtils";

const BillLists = ({
  title,
  headerTitles,
  dataProvider,
  setData,
  setBillPK,
  setModal,
  setDoneDialog,
  setDeleteDialog
}) => {
  return (
    <Table color="green" striped className="rtl">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan="10" className="rtl text-right">
            {title}
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          {headerTitles.map((eachTitle, index) => (
            <Table.HeaderCell
              className="text-center"
              key={`bill_list_header_${index}`}
            >
              {eachTitle}
            </Table.HeaderCell>
          ))}
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
                  setData({ pk: item.pk, type: "action", bill: item });
                  setBillPK(item.pk);
                  setModal(true);
                }}
                icon
                labelPosition="right"
                color="blue"
              >
                <span className="yekan">نمایش</span>
                <Icon name="info" />
              </Button>
              <Button
                onClick={() => {
                  setDoneDialog(item.pk);
                }}
                icon
                labelPosition="right"
                color="yellow"
              >
                <span className="yekan">بستن</span>
                <Icon name="lock" />
              </Button>
              <Button
                onClick={() => {
                  console.log("remove clicked: ", item.pk);
                  setDeleteDialog(item.pk);
                }}
                icon
                labelPosition="right"
                negative
              >
                <span className="yekan">حذف</span>
                <Icon name="close" />
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell colSpan="10" className="norm-latin">
            <Pagination
              className="norm-latin"
              defaultActivePage={1}
              totalPages={5}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

export default BillLists;
