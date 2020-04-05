import React, { Component } from "react";
import { connect } from "react-redux";
import { getChartsReport } from "../../actions/ReportsActions";
import { Segment, Table, Grid, Label } from "semantic-ui-react";
import { Doughnut, Bar, Pie } from "react-chartjs-2";
const colors = {
  blue: "#2185d0",
  orange: "#f2711c",
  green: "#21ba45",
  yellow: "#fbbd08"
};

const getLabel = _label =>
  _label === "حجم" ? "amount" : _label === "سود" ? "profit" : "price";

class Charts extends Component {
  state = {
    chartsReport: [],
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
    }
  };
  componentDidMount() {
    // if (!this.props.fetch) {
    // } else {
    // this.props.fetch === true
    // }
    this.setState(
      {
        chartsReport: this.props.chartsReport
      },
      () => {
        this.mixedBarFiller();
        this.circleFiller();
      }
    );
  }
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
    this.state.chartsReport &&
      this.getStateKeys().map(key => {
        let fillLabel = Object.keys(
          this.state.chartsReport[this.convertName(`sells_per_${key}`)]
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
                      this.state.chartsReport[
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
    this.state.chartsReport &&
      this.getCircleNames().map(key => {
        let fillLabel = Object.keys(
          this.state.chartsReport[this.convertName(`sells_per_${key}`)]
        );
        this.setState({
          [key]: {
            labels: fillLabel,
            datasets: this.state[key].datasets.map(dataset => ({
              ...dataset,
              data: fillLabel.map(
                label =>
                  this.state.chartsReport[this.convertName(`sells_per_${key}`)][
                    label
                  ].profit
              )
            }))
          }
        });
      });
  };
  render() {
    return (
      <React.Fragment>
        <Table celled className="rtl text-right yekan">
          <Table.Body>
            <Grid column={1} className="grid-padding" doubling>
              <Grid.Column computer={16} mobile={16}>
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

              <Grid.Column computer={8} mobile={16}>
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

              <Grid.Column className="grid-left" computer={8} mobile={16}>
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

              <Grid.Column computer={8} mobile={16}>
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

              <Grid.Column className="grid-left" computer={8} mobile={16}>
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

              <Grid.Column computer={8} mobile={16}>
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

              <Grid.Column className="grid-left" computer={8} mobile={16}>
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    chartsReport: state.reports.chartsReport
  };
};

export default connect(mapStateToProps, {
  getChartsReport
})(Charts);
