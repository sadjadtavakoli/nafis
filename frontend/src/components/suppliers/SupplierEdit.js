import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Input, Label } from "semantic-ui-react";
import { getTheSupplier, updateSupplier } from "../../actions/SuppliersActions";
import { toastr } from "react-redux-toastr";

const SupplierEdit = () => {
  const pk = Number(window.location.href.split("/")[5]);
  const [fetch, setFetch] = useState(false);
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  const [phone_number, setphone_number] = useState("");
  const [mobile_number, setmobile_number] = useState("");
  const [address, setaddress] = useState("");
  const [sotre, setstore] = useState("");

  const supplier = useSelector(state => state.suppliers.supplier);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTheSupplier(pk)).then(() => {
      setFetch(true);
      setfirst_name(supplier.first_name);
      setlast_name(supplier.last_name);
      setemail(supplier.email);
      setphone_number(supplier.phone_number);
      setmobile_number(supplier.mobile_number);
      setaddress(supplier.address);
      setstore(supplier.sotre);
    });
  }, []);

  const handleEditChange = (status, e) => {
    // set[status](e.target.value);
  };

  const createInput = (title, status, className, type = "text") => {
    return (
      <React.Fragment>
        <Label style={{ backgroundColor: "white" }}>{title}</Label>
        <br />
        <Input
          fluid
          className={className}
          onChange={e => handleEditChange(status, e)}
          defaultValue={supplier[status]}
          // error={state.hasErrors}
          type={type}
        />
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {fetch && (
        <Table className="text-right">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="2">
                نمایش و ویرایش اطلاعات تامین کننده {supplier.first_name}
                &nbsp;
                {supplier.last_name}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                {createInput(
                  "نام خانوادگی",
                  "last_name",
                  "rtl text-right text-yekan"
                )}
              </Table.Cell>
              <Table.Cell>
                {createInput("نام", "first_name", "rtl text-right text-yekan")}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                {createInput("فروشگاه", "store", "rtl text-right text-yekan")}
              </Table.Cell>
              <Table.Cell>
                {createInput("ایمیل", "email", "ltr text-left")}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                {createInput(
                  "شماره موبایل",
                  "mobile_number",
                  "ltr text-left norm-latin",
                  "number"
                )}
              </Table.Cell>
              <Table.Cell>
                {createInput(
                  "شماره تلفن",
                  "phone_number",
                  "ltr text-left norm-latin",
                  "number"
                )}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell>
                {createInput("آدرس", "address", "rtl text-right text-yekan")}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell>
                {/* <Button
                  className="yekan"
                  content="اعمال"
                  color="green"
                  onClick={handleSubmit}
                  disabled={state.hasChanged && !state.hasErrors ? false : true}
                /> */}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      )}
    </React.Fragment>
  );
};

export default SupplierEdit;
