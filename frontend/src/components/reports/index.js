import React from "react";
import { connect } from "react-redux";
import { getIntervalReports, getChartsReport } from "../../actions/ReportsActions";
import { Container, Segment, Input, Button, Table, Grid, Image, Label } from 'semantic-ui-react';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';

const colors = {
  blue: "#2185d0",
  orange: "#f2711c",
  green: "#21ba45"
}

const initData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
      label: 'Sales',
      type:'bar',
      data: [51, 65, 40, 49, 60, 37, 40],
      fill: false,
      borderColor: colors.blue,
      backgroundColor: colors.blue,
      pointBorderColor: colors.blue,
      pointBackgroundColor: colors.blue,
      pointHoverBackgroundColor: colors.blue,
      pointHoverBorderColor: colors.blue,
      yAxisID: 'y-axis-2'
    },{
      type: 'bar',
      label: 'Visitor',
      data: [200, 185, 590, 621, 250, 400, 95],
      fill: false,
      backgroundColor: colors.orange,
      borderColor: colors.orange,
      hoverBackgroundColor: colors.orange,
      hoverBorderColor: colors.orange,
      yAxisID: 'y-axis-1'
    },{
      type: 'bar',
      label: 'Visitor',
      data: [200, 185, 590, 621, 250, 400, 95],
      fill: false,
      backgroundColor: colors.green,
      borderColor: colors.green,
      hoverBackgroundColor: colors.green,
      hoverBorderColor: colors.green,
      yAxisID: 'y-axis-1'
    }]
};

const options = {
  responsive: true,
  tooltips: {
    mode: 'label'
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
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      },
      {
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-axis-2',
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }
    ]
  }
};


class Reports extends React.Component {
  state = {
    design: {
      data: initData,
      options: options
    },

    donought: {
      labels: [
        'Red',
        'Green',
        'Yellow'
      ],
      datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
        ],
        hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
        ]
      }]
    },

    pie: {
      labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
        ],
        hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
        ]
      }]
    }
  }
  componentDidMount() {
    this.props.getChartsReport();
    this.props.getIntervalReports();
  }
  componentDidUpdate() {
    console.log(1, this.props.chartReports); 
    console.log(2, this.props.intervalReports);
  }
  render() {
    return (
      <React.Fragment>
        <Container>

          <Segment stacked className="rtl">
            <span>از تاریخ</span>
            <Input />
            <span>تا تاریخ</span>
            <Input />
            <Button className="yekan">نمایش گزارش</Button>
          </Segment>
          
          <Table celled className="rtl text-right yekan">

            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan='12' className="rtl text-right">
                  <Grid>
                    <Grid.Column>
                      <span>لیست محصولات موجود</span>
                    </Grid.Column>
                  </Grid>
                </Table.HeaderCell>
              </Table.Row>

              <Table.Row> 
                <Table.HeaderCell className="table-border-left">مجموع سود</Table.HeaderCell>
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
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.props.intervalReports &&
                <Table.Row>
                  <Table.Cell className="table-border-left">{this.props.intervalReports.total_profit}</Table.Cell>
                  <Table.Cell>{this.props.intervalReports.total_discount}</Table.Cell>
                  <Table.Cell>{this.props.intervalReports.total_price}</Table.Cell>
                  <Table.Cell>{this.props.intervalReports.total_final_price}</Table.Cell>
                  <Table.Cell>{this.props.intervalReports.total_items}</Table.Cell>
                  <Table.Cell>{this.props.intervalReports.total_bills}</Table.Cell>
                  <Table.Cell>{this.props.intervalReports.total_cheque_paid}</Table.Cell>
                  <Table.Cell>{this.props.intervalReports.total_cash_paid}</Table.Cell>
                  <Table.Cell>{this.props.intervalReports.total_card_paid}</Table.Cell>
                  <Table.Cell>{this.props.intervalReports.total_paid}</Table.Cell>
                  <Table.Cell>{this.props.intervalReports.total_reminded_payments}</Table.Cell>
                  <Table.Cell>{this.props.intervalReports.bills_with_reminded_status}</Table.Cell>
                </Table.Row>
              }
            </Table.Body>
            
          </Table>

          <Table celled className="rtl text-right yekan">

            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan='12' className="rtl text-right">
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

                <Grid.Column width={8}>
                  <Segment>
                    <Label color='teal' ribbon='right' className="grid-label-rabon">طرح</Label>
                    {this.state.design ?
                      <Bar
                        data={this.state.design.data}
                        options={this.state.design.options}
                      />
                    : null}
                  </Segment>
                </Grid.Column>

                <Grid.Column className="grid-left" width={8}>
                  <Segment>
                    <Label color='teal' ribbon>رنگ طرح</Label>
                    {this.state.design ?
                      <Bar
                        data={this.state.design.data}
                        options={this.state.design.options}
                      />
                    : null}
                  </Segment>
                </Grid.Column>

                <Grid.Column width={8}>
                  <Segment>
                    <Label color='teal' ribbon='right' className="grid-label-rabon">رنگ پس‌زمینه</Label>
                    {this.state.design ?
                      <Bar
                        data={this.state.design.data}
                        options={this.state.design.options}
                      />
                    : null}
                  </Segment>
                </Grid.Column>

                <Grid.Column className="grid-left" width={8}>
                  <Segment>
                    <Label color='teal' ribbon>نوع پارچه</Label>
                    {this.state.design ?
                      <Bar
                        data={this.state.design.data}
                        options={this.state.design.options}
                      />
                    : null}
                  </Segment>
                </Grid.Column>

                <Grid.Column width={8}>
                  <Segment>
                    <Label color='teal' ribbon='right' className="grid-label-rabon">متریال</Label>
                    {this.state.design ?
                      <Bar
                        data={this.state.design.data}
                        options={this.state.design.options}
                      />
                    : null}
                  </Segment>
                </Grid.Column>
                
                <Grid.Column className="grid-left" width={8}>
                  <Segment>
                    <Label color='teal' ribbon>سن مشتری</Label>
                    {this.state.design ?
                      <Pie data={this.state.pie} />
                    : null}
                  </Segment>
                </Grid.Column>

                <Grid.Column width={8}>
                  <Segment>
                    <Label color='teal' ribbon='right' className="grid-label-rabon">نوع مشتری</Label>
                    {this.state.design ?
                      <Doughnut data={this.state.donought} />
                    : null}
                  </Segment>
                </Grid.Column>

              </Grid>
            </Table.Body>

          </Table>

        </Container>
      </React.Fragment>
    );
  }
} 

const mapStateToProps = state => {
  return {
    chartReports: state.reports.chartsReport,
    intervalReports: state.reports.intervalReports
  }
} 
  
export default connect(mapStateToProps, { getIntervalReports, getChartsReport })(Reports);