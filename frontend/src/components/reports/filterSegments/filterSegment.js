import React, { Component } from "react";
import { Segment, Table, Dropdown, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { getProductFields } from "../../../actions/DepositoryActions";
const SELECT_ALL_TEXT = "همه موارد";
const INITAL_OPTIONS = {
  branch: [],
  background_color: [],
  design_color: [],
  material: [],
  design: [],
  orderBySale: [
    { key: 1, value: 1, text: "حجم فروش" },
    { key: 2, value: 2, text: "تعداد فروش" },
    { key: 3, value: 3, text: "سود" },
    { key: 4, value: 4, text: "کل متراژ فروش" }
  ],
  f_type: []
};
class FilterSegment extends Component {
  state = {
    noResultsMessage: "نتیجه ای یافت نشد",
    selectedItems: [],
    options: INITAL_OPTIONS
  };
  componentDidMount() {
    this.props.getProductFields().then(response => {
      this.setState({
        ...this.state,
        options: { ...this.state.options, ...this.props.productFields }
      });
    });
  }
  clearFilter = () => {
    this.setState({ selectedItems: INITAL_OPTIONS }, () => {
      this.setState({ selectedItems: new Array() });
    });
  };
  dropDownHandleChange = (_, { id, value }) => {
    this.setState({
      selectedItems: { ...this.state.selectedItems, [id]: value }
    });
  };
  submitFilter = () => {
    this.props.submitFilter(this.state.selectedItems);
  };
  render() {
    return (
      <div className="d-segment pt-5">
        <Segment focused raised>
          <Table spa celled className="ltr text-right">
            <Table.Header colSpan={5}>
              <Table.Row>
                <Table.HeaderCell colSpan={"9"} className="rtl text-right">
                  <h4 className="yekan">
                    <span>ویژگی های پارچه</span>
                  </h4>
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>نوع پارچه</Table.HeaderCell>
                <Table.HeaderCell>جنس پارچه</Table.HeaderCell>
                <Table.HeaderCell>نوع طرح</Table.HeaderCell>
                <Table.HeaderCell>رنگ طرح</Table.HeaderCell>
                <Table.HeaderCell className="d-table-border">
                  رنگ پس‌زمینه
                </Table.HeaderCell>
                <Table.HeaderCell>فیلتر برحسب فروش</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  {/* نوع پارچه */}
                  <Dropdown
                    value={this.state.selectedItems.f_type}
                    onChange={this.dropDownHandleChange}
                    clearable
                    noResultsMessage={this.state.noResultsMessage}
                    search
                    placeholder={SELECT_ALL_TEXT}
                    fluid
                    multiple
                    selection
                    options={this.state.options.f_type}
                    id="f_type"
                  />
                </Table.Cell>
                <Table.Cell>
                  {/* جنس پارچه*/}
                  <Dropdown
                    value={this.state.selectedItems.material}
                    onChange={this.dropDownHandleChange}
                    clearable
                    noResultsMessage={this.state.noResultsMessage}
                    search
                    placeholder={SELECT_ALL_TEXT}
                    fluid
                    multiple
                    selection
                    options={this.state.options.material}
                    id="material"
                  />
                </Table.Cell>
                <Table.Cell>
                  {/* نوع طرح */}
                  <Dropdown
                    value={this.state.selectedItems.design}
                    onChange={this.dropDownHandleChange}
                    clearable
                    noResultsMessage={this.state.noResultsMessage}
                    search
                    placeholder={SELECT_ALL_TEXT}
                    fluid
                    multiple
                    selection
                    options={this.state.options.design}
                    id="design"
                  />
                </Table.Cell>
                <Table.Cell>
                  {/*  رنگ طرح */}
                  <Dropdown
                    value={this.state.selectedItems.design_color}
                    onChange={this.dropDownHandleChange}
                    clearable
                    noResultsMessage={this.state.noResultsMessage}
                    search
                    placeholder={SELECT_ALL_TEXT}
                    fluid
                    multiple
                    selection
                    options={this.state.options.design_color}
                    id="design_color"
                  />
                </Table.Cell>

                <Table.Cell className="d-table-border">
                  {/*  رنگ پس‌زمینه */}
                  <Dropdown
                    value={this.state.selectedItems.background_color}
                    onChange={this.dropDownHandleChange}
                    clearable
                    noResultsMessage={this.state.noResultsMessage}
                    search
                    placeholder={SELECT_ALL_TEXT}
                    fluid
                    multiple
                    selection
                    options={this.state.options.background_color}
                    id="background_color"
                  />
                </Table.Cell>
                <Table.Cell>
                  {/* فیلتر برحسب فروش*/}
                  <Dropdown
                    value={this.state.selectedItems.orderBySale}
                    onChange={this.dropDownHandleChange}
                    clearable
                    noResultsMessage={this.state.noResultsMessage}
                    search
                    placeholder={SELECT_ALL_TEXT}
                    fluid
                    multiple
                    selection
                    options={this.state.options.orderBySale}
                    id="orderBySale"
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <Table spa celled className="ltr text-right">
            <Table.Header colSpan={5}>
              <Table.Row>
                <Table.HeaderCell colSpan={"9"} className="rtl text-right">
                  <h4 className="yekan">
                    <span>ویژگی های مشتری</span>
                  </h4>
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>نوع مشتری</Table.HeaderCell>
                <Table.HeaderCell>سن مشتری</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  {/* نوع مشتری*/}
                  <Dropdown
                    value={this.state.selectedItems.orderBySale}
                    onChange={this.dropDownHandleChange}
                    clearable
                    noResultsMessage={this.state.noResultsMessage}
                    search
                    placeholder={SELECT_ALL_TEXT}
                    fluid
                    multiple
                    selection
                    options={this.state.options.orderBySale}
                    id="orderBySale"
                  />
                </Table.Cell>
                <Table.Cell>
                  {/* سن مشتری */}
                  <Dropdown
                    value={this.state.selectedItems.design}
                    onChange={this.dropDownHandleChange}
                    clearable
                    noResultsMessage={this.state.noResultsMessage}
                    search
                    placeholder={SELECT_ALL_TEXT}
                    fluid
                    multiple
                    selection
                    options={this.state.options.design}
                    id="design"
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <div className="ltr">
            <Button
              positive
              className="yekan"
              icon="checkmark"
              labelPosition="right"
              content="تایید"
              onClick={this.submitFilter}
            />
            <Button
              color="google plus"
              className="yekan"
              icon="erase"
              labelPosition="right"
              content="پاک کردن فیلتر"
              onClick={this.clearFilter}
            />
          </div>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    productFields: state.depository.productFields
  };
};
export default connect(mapStateToProps, { getProductFields })(FilterSegment);
