import React from "react";
import { Button, Modal } from "semantic-ui-react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import { connect } from "react-redux";

const INITIAL_STATE = {
  selectedDay: null
};

class SingleDatePickerModal extends React.Component {
  state = INITIAL_STATE;

  setSelectedDay = selectedDay => {
    console.log(selectedDay);
    this.setState({
      selectedDay
    });
  };

  handleClickSubmit = () => {
    let choosen = this.state.selectedDay;
    this.props.setDate(
      this.props.inputName,
      `${choosen.year}-${choosen.month}-${choosen.day}`
    );
    this.setState(INITIAL_STATE);
  };

  render() {
    return (
      <div>
        <Modal
          dimmer={"blurring"}
          open={this.props.isOpen}
          onClose={this.props.onClose}
          size="mini"
        >
          <Modal.Header className="text-right">
            {this.props.title || "انتخاب تاریخ"}
          </Modal.Header>
          <Modal.Content>
            <Calendar
              value={this.state.selectedDay}
              onChange={this.setSelectedDay}
              shouldHighlightWeekends
              locale="fa"
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="black"
              onClick={() => {
                this.setState(INITIAL_STATE, () => {
                  this.props.onClose();
                });
              }}
            >
              <p>لغو</p>
            </Button>
            <Button
              className="yekan"
              positive
              icon="checkmark"
              labelPosition="right"
              content="تایید"
              disabled={this.state.selectedDay == null}
              onClick={this.handleClickSubmit}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default connect(null)(SingleDatePickerModal);
