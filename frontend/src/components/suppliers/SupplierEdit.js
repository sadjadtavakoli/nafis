import React, { Component } from "react";
import { Button, Table, Input, Label } from "semantic-ui-react";
import { connect } from "react-redux";
import { getTheSupplier, updateSupplier } from "../../actions/SuppliersActions";
import { toastr } from "react-redux-toastr";

class SupplierEdit extends Component {
  state = {
    pk: null,

    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    mobile_number: "",
    address: "",
    store: "",

    first_name_b: false,
    last_name_b: false,
    email_b: false,
    phone_number_b: false,
    mobile_number_b: false,
    address_b: false,
    store_b: false,

    hasErrors: false,
    hasChanged: false
  };

  componentDidMount() {
    this.props
      .getTheSupplier(Number(window.location.href.split("/")[5]))
      .then(() => {
        this.setState({
          pk: Number(window.location.href.split("/")[5]),
          first_name: this.props.supplier.first_name,
          last_name: this.props.supplier.last_name,
          email: this.props.supplier.email,
          phone_number: this.props.supplier.phone_number,
          mobile_number: this.props.supplier.mobile_number,
          address: this.props.supplier.address,
          store: this.props.supplier.store
        });
      });
  }

  handleEdit = status => {
    const convertedStatus = this.convertStatus(status);
    this.setState({
      [convertedStatus]: true
    });
  };

  handleEditChange = (status, e) => {
    this.setState({
      [status]: e.target.value,
      hasChanged: true
    });
  };

  handleSubmit = () => {
    let hasErrors = false;
    if (String(this.state.first_name).length < 1) {
      this.setState({
        first_name_b: true
      });
      hasErrors = true;
    }
    if (String(this.state.last_name).length < 1) {
      this.setState({
        last_name_b: true
      });
      hasErrors = true;
    }
    if (String(this.state.email).length < 1) {
      this.setState({
        email_b: true
      });
      hasErrors = true;
    }
    if (String(this.state.phone_number).length < 1) {
      this.setState({
        phone_number_b: true
      });
      hasErrors = true;
    }
    if (String(this.state.mobile_number).length < 1) {
      this.setState({
        mobile_number_b: true
      });
      hasErrors = true;
    }
    if (String(this.state.address).length < 1) {
      this.setState({
        address_b: true
      });
      hasErrors = true;
    }
    if (String(this.state.store).length < 1) {
      this.setState({
        store_b: true
      });
      hasErrors = true;
    }
    if (!hasErrors) {
      let prepareData = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        phone_number: this.state.phone_number,
        mobile_number: this.state.mobile_number,
        address: this.state.address,
        store: this.state.store
      };
      this.props
        .updateSupplier(this.state.pk, prepareData)
        .then(() => {
          toastr.success(".عملیات ویرایش موفقیت آمیز بود");
        })
        .catch(() => {
          toastr.error(
            ".عملیات ویرایش موفقیت آمیز نبود. لطفا با تیم پشتیبانی در تماس باشید"
          );
        });
      this.setState({
        hasChanged: false
      });
    }
  };

  createInput = (title, status, className, type = "text") => {
    let b = status.concat("_b");
    return (
      <React.Fragment>
        <Label style={{ backgroundColor: "white" }}>{title}</Label>
        <br />
        <Input
          fluid
          className={className}
          onChange={e => this.handleEditChange(status, e)}
          defaultValue={this.state[status]}
          error={this.state[b]}
          type={type}
        />
      </React.Fragment>
    );
  };

  render() {
    return (
      <Table className="text-right">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">
              نمایش و ویرایش اطلاعات تامین کننده {this.state.first_name}
              &nbsp;
              {this.state.last_name}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              {this.createInput(
                "نام خانوادگی",
                "last_name",
                "rtl text-right text-yekan"
              )}
            </Table.Cell>
            <Table.Cell>
              {this.createInput(
                "نام",
                "first_name",
                "rtl text-right text-yekan"
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              {this.createInput(
                "فروشگاه",
                "store",
                "rtl text-right text-yekan"
              )}
            </Table.Cell>
            <Table.Cell>
              {this.createInput("ایمیل", "email", "ltr text-left")}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              {this.createInput(
                "شماره موبایل",
                "mobile_number",
                "ltr text-left norm-latin",
                "number"
              )}
            </Table.Cell>
            <Table.Cell>
              {this.createInput(
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
              {this.createInput("آدرس", "address", "rtl text-right text-yekan")}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell></Table.Cell>
            <Table.Cell>
              <Button
                className="yekan"
                content="اعمال"
                color="green"
                onClick={this.handleSubmit}
                disabled={
                  this.state.hasChanged && !this.state.hasErrors ? false : true
                }
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

const mapStateToProps = state => {
  return {
    supplier: state.suppliers.supplier
  };
};

export default connect(mapStateToProps, { getTheSupplier, updateSupplier })(
  SupplierEdit
);
