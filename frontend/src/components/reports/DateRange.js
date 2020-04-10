import React, { Component } from "react";
import { Segment, Input, Button, Icon } from "semantic-ui-react";
import {
  getTodayGregorian,
  toGregorian,
  getTodayJalaali,
} from "../utils/jalaaliUtils";
import { connect } from "react-redux";
import {
  getIntervalReports,
  getChartsReport,
} from "../../actions/ReportsActions";
import { getIntervalBillReport } from "../../actions/ReportsActions";

import DatePickerModal from "../utils/DatePickerModal";

class DateRange extends Component {
  state = {
    dateRange: this.props.dateRange || {
      fromDate: getTodayJalaali(),
      toDate: getTodayJalaali(),
    },
    calendarIsOpen: false,
  };
  handleCalendarClick = status => {
    this.setState({
      calendarIsOpen: status,
    });
  };
  setDate = (choosenFrom, choosenTo) => {
    let gregorianFromDate = this.convertToGregorian(choosenFrom);
    let gregorianToDate = this.convertToGregorian(choosenTo);

    let from = `${choosenFrom.year}-${choosenFrom.month}-${choosenFrom.day}`;
    let to = `${choosenTo.year}-${choosenTo.month}-${choosenTo.day}`;
    this.setState({
      gregorianFromDate,
      gregorianToDate,
      dateRange: {
        toDate: to,
        fromDate: from,
      },
      calendarIsOpen: false,
    });
  };

  componentDidMount() {
    console.log(2, this.props.dateRange);
    this.setState(
      {
        gregorianFromDate: getTodayGregorian(),
        gregorianToDate: getTodayGregorian(),
      },
      () => {
        if (!this.props.fetch) this.handleFetchData();
      }
    );
  }

  handleFetchData = e => {
    if (this.props.pageName === "GeneralStatistics") this.getIntervalReports();
    if (this.props.pageName === "IntervalBillReport") {
      console.log("getIntervalBillReport");
      this.getIntervalBillReport(this.props.activePage);
    }
    // this.getChartsReport();
  };
  convertToGregorian = date => {
    let g = toGregorian(date.year, date.month, date.day);
    return `${g.gy}-${g.gm}-${g.gd}`;
  };

  getIntervalReports = () => {
    this.props
      .getIntervalReports(
        1,
        this.state.gregorianFromDate,
        this.state.gregorianToDate
      )
      .then(() => {});
  };
  findGetParameter = (url, parameterName) => {
    var result = null,
      tmp = [];
    url
      .substr(1)
      .split("&")
      .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
      });
    return result;
  };
  getIntervalBillReport = (
    activePage,
    start_date = this.state.gregorianFromDate,
    end_date = this.state.gregorianToDate
  ) => {
    this.props
      .getIntervalBillReport(activePage, start_date, end_date)
      .then(res => {
        console.log("res dailyReport", res.data);
      });
  };
  getChartsReport = () => {
    this.props
      .getChartsReport(
        1,
        this.state.gregorianFromDate,
        this.state.gregorianToDate
      )
      .then(() => {});
  };
  render() {
    return (
      <React.Fragment>
        <Segment stacked className="rtl">
          <React.Fragment id="r-form">
            <span className="r-form-span-padding">از تاریخ</span>
            <Input
              value={this.state.dateRange.fromDate}
              className="r-input"
              readOnly
            />
            <span className="r-form-span-padding">تا تاریخ</span>
            <Input
              value={this.state.dateRange.toDate}
              className="r-input"
              readOnly
            />
            <Icon
              onClick={() => this.handleCalendarClick(true)}
              name="calendar alternate outline"
              color="teal"
              size="big"
              className="date-picker-icon"
            />
            <Button
              className="yekan"
              icon
              color="yellow"
              onClick={this.handleFetchData}
              labelPosition="right"
            >
              <span>نمایش گزارش</span>
              <Icon name="search" />
            </Button>
          </React.Fragment>
          {/* <FilterSegment /> */}
        </Segment>
        <DatePickerModal
          onClose={() => this.handleCalendarClick(false)}
          isOpen={this.state.calendarIsOpen}
          setDate={this.setDate}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  console.log("state", state.reports);
  return {
    chartsReport: state.reports.chartsReport,
    intervalReports: state.reports.intervalReports,
    intervalBillReport: state.reports.intervalBillReport,
  };
};

export default connect(mapStateToProps, {
  getIntervalReports,
  getChartsReport,
  getIntervalBillReport,
})(DateRange);
