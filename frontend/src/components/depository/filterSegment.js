import React, { Component } from "react";
import { Segment, Table, Dropdown, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { getProductFields } from "../../actions/DepositoryActions";

const options = [
  { key: "angular", text: "Angular", value: "angular" },
  { key: "css", text: "CSS", value: "css" },
  { key: "design", text: "Graphic Design", value: "design" },
  { key: "ember", text: "Ember", value: "ember" },
  { key: "html", text: "HTML", value: "html" },
  { key: "ia", text: "Information Architecture", value: "ia" },
  { key: "javascript", text: "Javascript", value: "javascript" },
  { key: "mech", text: "Mechanical Engineering", value: "mech" },
  { key: "meteor", text: "Meteor", value: "meteor" },
  { key: "node", text: "NodeJS", value: "node" },
  { key: "plumbing", text: "Plumbing", value: "plumbing" },
  { key: "python", text: "Python", value: "python" },
  { key: "rails", text: "Rails", value: "rails" },
  { key: "react", text: "React", value: "react" },
  { key: "repair", text: "Kitchen Repair", value: "repair" },
  { key: "ruby", text: "Ruby", value: "ruby" },
  { key: "ui", text: "UI Design", value: "ui" },
  { key: "ux", text: "User Experience", value: "ux" }
];

class FilterSegment extends Component {
  componentDidMount() {
    this.props.getProductFields();
    console.log("product fields", this.props.productFields);
  }

  render() {
    return (
      <div className="d-segment pt-5">
        <Segment raised>
          <Table celled className="rtl text-right">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="d-table-border">
                  رنگ پس‌زمینه
                </Table.HeaderCell>
                <Table.HeaderCell>رنگ طرح</Table.HeaderCell>
                <Table.HeaderCell>جنس</Table.HeaderCell>
                <Table.HeaderCell>نوع پارچه</Table.HeaderCell>
                <Table.HeaderCell>نوع طرح</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell className="d-table-border">
                  <Dropdown
                    placeholder="همه"
                    fluid
                    multiple
                    selection
                    options={options}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Dropdown
                    placeholder="همه"
                    fluid
                    multiple
                    selection
                    options={options}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Dropdown
                    placeholder="همه"
                    fluid
                    multiple
                    selection
                    options={options}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Dropdown
                    placeholder="همه"
                    fluid
                    multiple
                    selection
                    options={options}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Dropdown
                    placeholder="همه"
                    fluid
                    multiple
                    selection
                    options={options}
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
                color="orange"
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
