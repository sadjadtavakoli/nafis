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
import DatePickerModal from "./DatePickerModal";
import NotFound from '../utils/notFound'
const colors = {
  blue: "#2185d0",
  orange: "#f2711c",
  green: "#21ba45",
  yellow: "#fbbd08"
};

const getLabel = _label =>
  _label === "حجم" ? "amount" : _label === "سود" ? "profit" : "price";

class Reports extends React.Component {
  state = {
    options: {
      responsive: true,
      tooltips: {
        mode: "label"
      },
      elements: {
        line: {
          fill: false
        }
      },
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              display: false
            },
            labels: {
              show: true
            }
          }
        ],
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            gridLines: {
              display: false
            },
            labels: {
              show: true
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              display: false
            },
            labels: {
              show: true
            }
          }
        ]
      }
    },

    design: {
      inMixedBarFiller: true,
      data: {
        labels: [],
        datasets: [
          {
            label: "حجم",
            type: "bar",
            data: [],
            fill: false,
            borderColor: colors.blue,
            backgroundColor: colors.blue,
            pointBorderColor: colors.blue,
            pointBackgroundColor: colors.blue,
            pointHoverBackgroundColor: colors.blue,
            pointHoverBorderColor: colors.blue,
            yAxisID: "y-axis-2"
          },
          {
            label: "سود",
            type: "bar",
            data: [],
            fill: false,
            backgroundColor: colors.orange,
            borderColor: colors.orange,
            hoverBackgroundColor: colors.orange,
            hoverBorderColor: colors.orange,
            yAxisID: "y-axis-1"
          },
          {
            label: "قیمت",
            type: "bar",
            data: [],
            fill: false,
            backgroundColor: colors.green,
            borderColor: colors.green,
            hoverBackgroundColor: colors.green,
            hoverBorderColor: colors.green,
            yAxisID: "y-axis-1"
          }
        ]
      }
    },

    designColor: {
      inMixedBarFiller: true,
      data: {
        labels: [],
        datasets: [
          {
            label: "حجم",
            type: "bar",
            data: [],
            fill: false,
            borderColor: colors.blue,
            backgroundColor: colors.blue,
            pointBorderColor: colors.blue,
            pointBackgroundColor: colors.blue,
            pointHoverBackgroundColor: colors.blue,
            pointHoverBorderColor: colors.blue,
            yAxisID: "y-axis-2"
          },
          {
            label: "سود",
            type: "bar",
            data: [],
            fill: false,
            backgroundColor: colors.orange,
            borderColor: colors.orange,
            hoverBackgroundColor: colors.orange,
            hoverBorderColor: colors.orange,
            yAxisID: "y-axis-1"
          },
          {
            label: "قیمت",
            type: "bar",
            data: [],
            fill: false,
            backgroundColor: colors.green,
            borderColor: colors.green,
            hoverBackgroundColor: colors.green,
            hoverBorderColor: colors.green,
            yAxisID: "y-axis-1"
          }
        ]
      }
    },

    bgColor: {
      inMixedBarFiller: true,
      data: {
        labels: [],
        datasets: [
          {
            label: "حجم",
            type: "bar",
            data: [],
            fill: false,
            borderColor: colors.blue,
            backgroundColor: colors.blue,
            pointBorderColor: colors.blue,
            pointBackgroundColor: colors.blue,
            pointHoverBackgroundColor: colors.blue,
            pointHoverBorderColor: colors.blue,
            yAxisID: "y-axis-2"
          },
          {
            label: "سود",
            type: "bar",
            data: [],
            fill: false,
            backgroundColor: colors.orange,
            borderColor: colors.orange,
            hoverBackgroundColor: colors.orange,
            hoverBorderColor: colors.orange,
            yAxisID: "y-axis-1"
          },
          {
            label: "قیمت",
            type: "bar",
            data: [],
            fill: false,
            backgroundColor: colors.green,
            borderColor: colors.green,
            hoverBackgroundColor: colors.green,
            hoverBorderColor: colors.green,
            yAxisID: "y-axis-1"
          }
        ]
      }
    },

    fType: {
      inMixedBarFiller: true,
      data: {
        labels: [],
        datasets: [
          {
            label: "حجم",
            type: "bar",
            data: [],
            fill: false,
            borderColor: colors.blue,
            backgroundColor: colors.blue,
            pointBorderColor: colors.blue,
            pointBackgroundColor: colors.blue,
            pointHoverBackgroundColor: colors.blue,
            pointHoverBorderColor: colors.blue,
            yAxisID: "y-axis-2"
          },
          {
            label: "سود",
            type: "bar",
            data: [],
            fill: false,
            backgroundColor: colors.orange,
            borderColor: colors.orange,
            hoverBackgroundColor: colors.orange,
            hoverBorderColor: colors.orange,
            yAxisID: "y-axis-1"
          },
          {
            label: "قیمت",
            type: "bar",
            data: [],
            fill: false,
            backgroundColor: colors.green,
            borderColor: colors.green,
            hoverBackgroundColor: colors.green,
            hoverBorderColor: colors.green,
            yAxisID: "y-axis-1"
          }
        ]
      }
    },

    material: {
      inMixedBarFiller: true,
      data: {
        labels: [],
        datasets: [
          {
            label: "حجم",
            type: "bar",
            data: [],
            fill: false,
            borderColor: colors.blue,
            backgroundColor: colors.blue,
            pointBorderColor: colors.blue,
            pointBackgroundColor: colors.blue,
            pointHoverBackgroundColor: colors.blue,
            pointHoverBorderColor: colors.blue,
            yAxisID: "y-axis-2"
          },
          {
            label: "سود",
            type: "bar",
            data: [],
            fill: false,
            backgroundColor: colors.orange,
            borderColor: colors.orange,
            hoverBackgroundColor: colors.orange,
            hoverBorderColor: colors.orange,
            yAxisID: "y-axis-1"
          },
          {
            label: "قیمت",
            type: "bar",
            data: [],
            fill: false,
            backgroundColor: colors.green,
            borderColor: colors.green,
            hoverBackgroundColor: colors.green,
            hoverBorderColor: colors.green,
            yAxisID: "y-axis-1"
          }
        ]
      }
    },

    customerType: {
      inMixedBarFiller: false,
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            colors.blue,
            colors.orange,
            colors.green,
            colors.yellow
          ],
          hoverBackgroundColor: [
            colors.blue,
            colors.orange,
            colors.green,
            colors.yellow
          ]
        }
      ]
    },

    customerAge: {
      inMixedBarFiller: false,
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [colors.blue, colors.orange, colors.green],
          hoverBackgroundColor: [colors.blue, colors.orange, colors.green]
        }
      ]
    },

    calendarIsOpen: false,

    dateRange: {
      fromDate: getTodayJalaali(),
      toDate: getTodayJalaali()
    }
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
    console.log(from, to);
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

  getStateKeys = () => {
    return Object.keys(this.state).filter(
      key => this.state[key].inMixedBarFiller
    );
  };

  convertName = name => {
    return name
      .split("")
      .map(char =>
        char !== "_" && char === char.toUpperCase()
          ? `_${char.toLowerCase()}`
          : char
      )
      .join("");
  };

  matchArray = (array, queryArray) => {
    return (
      queryArray.length === array.length &&
      queryArray.every(query => !!array.filter(value => value === query).length)
    );
  };

  mixedBarFiller = () => {
    this.props.chartsReport &&
      this.getStateKeys().map(key => {
        let fillLabel = Object.keys(
          this.props.chartsReport[this.convertName(`sells_per_${key}`)]
        );
        if (!this.matchArray(this.state[key].data.labels, fillLabel)) {
          this.setState({
            [key]: {
              data: {
                labels: fillLabel,
                datasets: this.state[key].data.datasets.map(dataset => ({
                  ...dataset,
                  data: fillLabel.map(
                    label =>
                      this.props.chartsReport[
                        this.convertName(`sells_per_${key}`)
                      ][label][getLabel(dataset.label)]
                  )
                }))
              }
            }
          });
        }
      });
  };

  getCircleNames = () =>
    Object.keys(this.state).filter(
      key => this.state[key].inMixedBarFiller === false
    );

  circleFiller = () => {
    this.props.chartsReport &&
      this.getCircleNames().map(key => {
        let fillLabel = Object.keys(
          this.props.chartsReport[this.convertName(`sells_per_${key}`)]
        );
        this.setState({
          [key]: {
            labels: fillLabel,
            datasets: this.state[key].datasets.map(dataset => ({
              ...dataset,
              data: fillLabel.map(
                label =>
                  this.props.chartsReport[this.convertName(`sells_per_${key}`)][
                    label
                  ].profit
              )
            }))
          }
        });
      });
  };

  componentDidMount() {
    this.setState({
      gregorianFromDate: getTodayGregorian(),
      gregorianToDate: getTodayGregorian()
    });
    this.props.getChartsReport(1, getTodayGregorian(), getTodayGregorian());
    this.props.getIntervalReports(1, getTodayGregorian(), getTodayGregorian());
  }

  componentDidUpdate() {
    this.mixedBarFiller();
    this.circleFiller();
  }

  handleFetchData = e => {
    e.preventDefault();
    this.props.getChartsReport(
      1,
      this.state.gregorianFromDate,
      this.state.gregorianToDate
    );
    this.props.getIntervalReports(
      1,
      this.state.gregorianFromDate,
      this.state.gregorianToDate
    );
  };

  render() {
    return (
      <React.Fragment>
        <Container>
          <Segment stacked className="rtl">
            <form onSubmit={this.sendDate}>
              <span className="padded">از تاریخ</span>
              <Input value={this.state.dateRange.fromDate} readOnly />
              <span className="padded">تا تاریخ</span>
              <Input value={this.state.dateRange.toDate} readOnly />
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
            </form>
          </Segment>

          <Table celled className="rtl text-center yekan">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="12" className="rtl text-right">
                  <Grid>
                    <Grid.Column>
                      <span>آمار کلی</span>
                    </Grid.Column>
                  </Grid>
                </Table.HeaderCell>
              </Table.Row>

              {this.props.intervalReports && (<Table.Row>
                <Table.HeaderCell className="table-border-left">
                  مجموع سود
                </Table.HeaderCell>
                <Table.HeaderCell>تخفیف</Table.HeaderCell>
                <Table.HeaderCell>مبلغ</Table.HeaderCell>
                <Table.HeaderCell>مبلغ نهایی</Table.HeaderCell>
                <Table.HeaderCell>مجموع اقلام</Table.HeaderCell>
                <Table.HeaderCell>مجموع فاکتورها</Table.HeaderCell>
                <Table.HeaderCell>مجموع چک های پرداخت شده</Table.HeaderCell>
                <Table.HeaderCell>مجموع پرداخت های نقدی</Table.HeaderCell>
                <Table.HeaderCell>مجموع پرداخت های کارتی</Table.HeaderCell>
                <Table.HeaderCell>مجموع پرداخت ها</Table.HeaderCell>
                <Table.HeaderCell>مجموع پرداخت های باقی مانده</Table.HeaderCell>
                <Table.HeaderCell>فاکتورهای پرداخت نشده</Table.HeaderCell>
              </Table.Row>)}
              {!this.props.intervalReports && <NotFound />}
            </Table.Header>

            <Table.Body>
              {this.props.intervalReports && (
                <Table.Row>
                  <Table.Cell className="table-border-left">
                    {this.props.intervalReports.total_profit}
                  </Table.Cell>
                  <Table.Cell>
                    {this.props.intervalReports.total_discount}
                  </Table.Cell>
                  <Table.Cell>
                    {this.props.intervalReports.total_price}
                  </Table.Cell>
                  <Table.Cell>
                    {this.props.intervalReports.total_final_price}
                  </Table.Cell>
                  <Table.Cell>
                    {this.props.intervalReports.total_items}
                  </Table.Cell>
                  <Table.Cell>
                    {this.props.intervalReports.total_bills}
                  </Table.Cell>
                  <Table.Cell>
                    {this.props.intervalReports.total_cheque_paid}
                  </Table.Cell>
                  <Table.Cell>
                    {this.props.intervalReports.total_cash_paid}
                  </Table.Cell>
                  <Table.Cell>
                    {this.props.intervalReports.total_card_paid}
                  </Table.Cell>
                  <Table.Cell>
                    {this.props.intervalReports.total_paid}
                  </Table.Cell>
                  <Table.Cell>
                    {this.props.intervalReports.total_reminded_payments}
                  </Table.Cell>
                  <Table.Cell>
                    {this.props.intervalReports.bills_with_reminded_status}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>

          <Table celled className="rtl text-right yekan">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="12" className="rtl text-right">
                  <Grid>
                    <Grid.Column>
                      <span>داده های آماری</span>
                    </Grid.Column>
                  </Grid>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Grid column={2} className="grid-padding">
                <Grid.Column width={16}>
                  <Segment>
                    <Label
                      color="teal"
                      ribbon="right"
                      className="grid-label-rabon"
                    >
                      طرح
                    </Label>
                    {this.state.design ? (
                      <Bar
                        data={this.state.design.data}
                        options={this.state.options}
                      />
                    ) : null}
                  </Segment>
                </Grid.Column>

                <Grid.Column width={8}>
                  <Segment>
                    <Label
                      color="teal"
                      ribbon="right"
                      className="grid-label-rabon"
                    >
                      رنگ طرح
                    </Label>
                    {this.state.designColor ? (
                      <Bar
                        data={this.state.designColor.data}
                        options={this.state.options}
                      />
                    ) : null}
                  </Segment>
                </Grid.Column>

                <Grid.Column className="grid-left" width={8}>
                  <Segment>
                    <Label color="teal" ribbon>
                      رنگ پس‌زمینه
                    </Label>
                    {this.state.bgColor ? (
                      <Bar
                        data={this.state.bgColor.data}
                        options={this.state.options}
                      />
                    ) : null}
                  </Segment>
                </Grid.Column>

                <Grid.Column width={8}>
                  <Segment>
                    <Label
                      color="teal"
                      ribbon="right"
                      className="grid-label-rabon"
                    >
                      نوع پارچه
                    </Label>
                    {this.state.fType ? (
                      <Bar
                        data={this.state.fType.data}
                        options={this.state.options}
                      />
                    ) : null}
                  </Segment>
                </Grid.Column>

                <Grid.Column className="grid-left" width={8}>
                  <Segment>
                    <Label color="teal" ribbon>
                      متریال
                    </Label>
                    {this.state.material ? (
                      <Bar
                        data={this.state.material.data}
                        options={this.state.options}
                      />
                    ) : null}
                  </Segment>
                </Grid.Column>

                <Grid.Column width={8}>
                  <Segment>
                    <Label
                      color="teal"
                      ribbon="right"
                      className="grid-label-rabon"
                    >
                      سن مشتری
                    </Label>
                    {this.state.customerAge ? (
                      <Pie data={this.state.customerAge} />
                    ) : null}
                  </Segment>
                </Grid.Column>

                <Grid.Column className="grid-left" width={8}>
                  <Segment>
                    <Label color="teal" ribbon>
                      نوع مشتری
                    </Label>
                    {this.state.customerType ? (
                      <Doughnut data={this.state.customerType} />
                    ) : null}
                  </Segment>
                </Grid.Column>
              </Grid>
            </Table.Body>
          </Table>
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
