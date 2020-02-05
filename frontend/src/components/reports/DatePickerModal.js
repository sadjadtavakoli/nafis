import React from "react";
import { Button, Modal } from "semantic-ui-react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import { connect } from "react-redux";

const INITIAL_STATE = {
  selectedDayRange: {
    from: null,
    to: null
  }
};

class DatePickerModal extends React.Component {
  state = INITIAL_STATE;

  setSelectedDayRange = e => {
    console.log(e);
    this.setState({
      selectedDayRange: {
        ...this.state.selectedDayRange,
        from: e.from,
        to: e.to
      }
    });
  };

  handleClickSubmit = () => {
    let choosenFrom = this.state.selectedDayRange.from;
    let choosenTo = this.state.selectedDayRange.to;
    this.props.setDate(choosenFrom, choosenTo);
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
          <Modal.Header className="text-right">انتخاب تاریخ</Modal.Header>
          <Modal.Content>
            <Calendar
              value={this.state.selectedDayRange}
              onChange={this.setSelectedDayRange}
              shouldHighlightWeekends
              locale="fa"
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="black"
              onClick={() => {
                this.props.onClose();
                this.setState(INITIAL_STATE);
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
              disabled={
                this.state.selectedDayRange.from == null ||
                this.state.selectedDayRange.to == null
              }
              onClick={this.handleClickSubmit}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default connect(null)(DatePickerModal);
