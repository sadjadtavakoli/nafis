import React from "react";
import { connect } from "react-redux";
import {
  getIntervalReports,
  getChartsReport
} from "../../actions/ReportsActions";
import {
  Container,
  Segment,
  Input,
  Button,
  Table,
  Tab,
  Grid,
  Label,
  Icon
} from "semantic-ui-react";
import { Doughnut, Bar, Pie } from "react-chartjs-2";
import {
  getTodayGregorian,
  toGregorian,
  getTodayJalaali
} from "../utils/jalaaliUtils";
import DatePickerModal from "../utils/DatePickerModal";
import GeneralStatistics from "./GeneralStatistics";
import Charts from "./Charts";
import FilterSegment from "./filterSegments/filterSegment";

class Reports extends React.Component {
  state = {
    panes: [
      {
        menuItem: "آمارکلی",
        render: () => (
          <Tab.Pane attached={false}>
            <GeneralStatistics fetch={this.state.fetch} />
          </Tab.Pane>
        )
      },
      {
        menuItem: "نمودارها",
        render: () => (
          <Tab.Pane attached={false}>
            <Charts fetch={this.state.fetch} />
          </Tab.Pane>
        )
      },
      {
        menuItem: "فاکتورها",
        render: () => (
          <Tab.Pane attached={false}>
            {/* <ProductTable edit={false} /> */}
          </Tab.Pane>
        )
      }
    ],
    fetch: false,
    dateRange: {
      fromDate: getTodayJalaali(),
      toDate: getTodayJalaali()
    },
    calendarIsOpen: false
  };

  handleCalendarClick = status => {
    this.setState({
      calendarIsOpen: status
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
        fromDate: from
      },
      calendarIsOpen: false
    });
  };

  convertToGregorian = date => {
    let g = toGregorian(date.year, date.month, date.day);
    return `${g.gy}-${g.gm}-${g.gd}`;
  };

  componentDidMount() {
    this.setState(
      {
        gregorianFromDate: getTodayGregorian(),
        gregorianToDate: getTodayGregorian()
      },
      () => {
        this.handleFetchData();
      }
    );
  }

  handleFetchData = e => {
    this.setState({ fetch: false }, () => {
      this.getIntervalReports();
      this.getChartsReport();
    });
  };
  getIntervalReports = () => {
    this.props
      .getIntervalReports(
        1,
        this.state.gregorianFromDate,
        this.state.gregorianToDate
      )
      .then(() => {
        this.setState({ fetch: true });
      });
  };
  getChartsReport = () => {
    this.props
      .getChartsReport(
        1,
        this.state.gregorianFromDate,
        this.state.gregorianToDate
      )
      .then(() => {
        this.setState({ fetch: false });
      });
  };
  render() {
    return (
      <React.Fragment>
        <Container>
          <Segment stacked className="rtl">
            <React.Fragment onSubmit={this.sendDate} id="r-form">
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
            <FilterSegment />
          </Segment>
          <Tab
            renderActiveOnly={true}
            menu={{ pointing: true }}
            panes={this.state.panes}
          />
        </Container>
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
  return {
    chartsReport: state.reports.chartsReport,
    intervalReports: state.reports.intervalReports
  };
};

export default connect(mapStateToProps, {
  getIntervalReports,
  getChartsReport
})(Reports);
