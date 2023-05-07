import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import {
  Button,
  Checkbox,
  Grid,
  Pagination,
  Segment,
  Table,
} from 'semantic-ui-react'
import { deleteBill } from '../../actions/CashRegisterActions'
import { getAllBills, getRemainedBills } from '../../actions/CustomersActions'
import history from '../../history'
import { convertToJalaali } from '../utils/jalaaliUtils'
import LoadingBar from '../utils/loadingBar'
import NotFound from '../utils/notFound'
import { digitToComma } from '../utils/numberUtils'
import TableLabel from '../utils/tableLabelGenerator'

class FactorsTab extends Component {
  state = {
    fetch: false,
    remainedBillsToggle: false,
    searchLoading: false,
    activePage: 1,
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.props.getAllBills(this.props.passingPk).then(() => {
      this.setState({
        fetch: true,
      })
    })
  }
  handleToggleClick = () => {
    this.setState(
      { remainedBillsToggle: !this.state.remainedBillsToggle, fetch: false },
      () => {
        if (this.state.remainedBillsToggle === true) {
          this.props.getRemainedBills(this.props.passingPk).then((res) => {
            this.setState({ fetch: true })
          })
        } else {
          this.fetchData()
        }
      }
    )
  }

  deleteBill = (pk) => {
    var r = window.confirm('آیا از حذف این مورد مطمئن هستید؟')
    if (r == true) {
      this.props
        .deleteBill(pk)
        .then(() => {
          toastr.success('فاکتور با موفقیت حذف شد')
          this.fetchData()
        })
        .catch(() => {
          toastr.error(
            'خطا در عملیات حذف فاکتور',
            'نمی‌توانید فاکتوری را که پرداخت دارد حذف کنید، ابتدا پرداخت‌ها را حذف نموده سپس نسبت به حذف فاکتور اقدام نمایید'
          )
        })
    }
  }

  handleSearchChange = (_, { value }) => {
    this.setState({ searchLoading: true, value, fetch: false })
    setTimeout(() => {
      if (this.state.value.length < 1) {
        this.fetchData(this.state.activePage)
      } else {
        this.props
          .fetchData(this.state.value)
          .then(() => {
            this.setState({
              notFound: false,
              totalPageCount: 1,
              fetch: true,
            })
          })
          .catch(() => {
            this.setState({ notFound: true })
          })
      }
      this.setState({
        searchLoading: false,
      })
    }, 300)
  }

  changePage = (_, { activePage }) => {
    this.setState({ fetch: false })
    this.setState({ activePage }, () => {
      this.props
        .getAllBills(this.props.passingPk, this.state.activePage)
        .then(() => {
          this.setState({ fetch: true })
        })
    })
  }

  createTable = () => {
    let bills = this.state.remainedBillsToggle
      ? this.props.remainedBills
      : this.props.allBills
    return (
      <Table celled structured className="text-center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              colSpan={this.state.remainedBillsToggle ? '14' : '12'}
            >
              <Grid>
                <Grid.Row columns="2">
                  <Grid.Column verticalAlign="middle" width="2">
                    <h3 className="yekan text-right">
                      {this.state.remainedBillsToggle
                        ? 'فاکتورهای‌باقی‌مانده'
                        : 'فاکتورها'}
                    </h3>
                  </Grid.Column>
                  {/* <Grid.Column textAlign="right" verticalAlign="middle">
                    <Search
                      input={{ icon: "search", iconPosition: "left" }}
                      loading={this.state.searchLoading}
                      showNoResults={false}
                      placeholder="کد محصول را وارد نمایید"
                      className="placeholder-rtl yekan ltr"
                      onSearchChange={this.handleSearchChange}
                    />
                  </Grid.Column> */}
                </Grid.Row>
              </Grid>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {this.state.fetch && bills.count ? (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="d-table-border">
                <TableLabel count={1}>ردیف</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={2}>شماره فاکتور</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={3}>شماره همراه</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={4}>تاریخ بسته شدن</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={5}>تعداد اقلام</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={6}>نام فروشنده</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={7}>نام صندوق دار</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={8}>قیمت بدون تخفیف</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={9}>تخفیف</TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel count={10}>قیمت کل</TableLabel>
              </Table.HeaderCell>
              {this.state.remainedBillsToggle ? (
                <Table.HeaderCell>
                  <TableLabel count={11}>بهای پرداخت شده</TableLabel>
                </Table.HeaderCell>
              ) : null}
              {this.state.remainedBillsToggle ? (
                <Table.HeaderCell>
                  <TableLabel count={12}>بهای پرداختی مانده</TableLabel>
                </Table.HeaderCell>
              ) : null}
              <Table.HeaderCell>
                <TableLabel
                  count={this.state.remainedBillsToggle ? '13' : '11'}
                >
                  حالت فاکتور
                </TableLabel>
              </Table.HeaderCell>
              <Table.HeaderCell>عملیات</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        ) : (
          <NotFound />
        )}
        <Table.Body>
          {this.state.fetch &&
            bills.results.map((bill, index) => {
              return (
                <Table.Row key={bill.pk}>
                  <Table.Cell className="d-table-border" id="norm-latin">
                    <TableLabel count={1}>{index + 1}</TableLabel>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel count={2}>
                      <span>{bill.pk}</span>
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel count={3}>
                      <span>{bill.buyer.phone_number}</span>
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel count={4}>
                      {bill.close_date ? (
                        <span>{convertToJalaali(bill.close_date)}</span>
                      ) : (
                        <span className="yekan">ندارد</span>
                      )}
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell id="norm-latin">
                    <TableLabel count={5}>
                      <span id="norm-latin">{bill.items.length}</span>
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell className="yekan">
                    <TableLabel count={6}>
                      <span>
                        {bill.seller.ffirst_name}&nbsp;{bill.seller.last_name}
                      </span>
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell className="yekan">
                    <TableLabel count={7}>
                      <span>
                        {bill.closande ? (
                          <span>
                            {bill.closande.first_name}&nbsp;
                            {bill.closande.last_name}
                          </span>
                        ) : (
                          'موجود نمی باشد'
                        )}
                      </span>
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel count={8}>
                      <span className="yekan">تومان</span>
                      <span>{digitToComma(bill.price)}</span>&nbsp;
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel count={9}>
                      <span className="yekan">تومان</span>
                      <span>{digitToComma(bill.discount)}</span>&nbsp;
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell className="norm-latin">
                    <TableLabel count={10}>
                      <span className="yekan"> تومان</span>
                      <span>{digitToComma(bill.final_price)}</span>
                    </TableLabel>
                  </Table.Cell>
                  {this.state.remainedBillsToggle ? (
                    <Table.Cell className="norm-latin">
                      <TableLabel count={11}>
                        <span className="yekan"> تومان</span>
                        <span>{digitToComma(bill.paid)}</span>
                      </TableLabel>
                    </Table.Cell>
                  ) : null}
                  {this.state.remainedBillsToggle ? (
                    <Table.Cell className="norm-latin">
                      <TableLabel count={12}>
                        <span>{bill.final_price - bill.paid}</span>
                      </TableLabel>
                    </Table.Cell>
                  ) : null}
                  <Table.Cell className="yekan">
                    <TableLabel
                      count={this.state.remainedBillsToggle ? '13' : '11'}
                    >
                      <span>{bill.status === 'done' ? 'تسویه' : null}</span>
                      <span>{bill.status === 'active' ? 'باز' : null}</span>
                      <span>{bill.status === 'remained' ? 'مانده' : null}</span>
                    </TableLabel>
                  </Table.Cell>
                  <Table.Cell className="yekan">
                    <Button
                      className="yekan w-100"
                      color="teal"
                      size="mini"
                      onClick={() => {
                        history.push(`/cashregister/${bill.pk}`)
                      }}
                      content="مشاهده"
                      icon="info"
                      labelPosition="right"
                    />
                    <br />
                    <Button
                      className="yekan w-100"
                      color="red"
                      style={{ marginTop: '3px' }}
                      size="mini"
                      onClick={() => this.deleteBill(bill.pk)}
                      content="حذف‌فاکتور"
                      icon="trash"
                      labelPosition="right"
                    />
                    <br />
                    <Button
                      className="yekan w-100"
                      color="teal"
                      style={{ marginTop: '3px' }}
                      size="mini"
                      onClick={() => {
                        history.push(`/factor/${bill.pk}/print`)
                      }}
                      content="چاپ‌فاکتور"
                      icon="print"
                      labelPosition="right"
                    />
                  </Table.Cell>
                </Table.Row>
              )
            })}
        </Table.Body>
        {this.props.allBills && this.props.allBills.count > 25 ? (
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell
                colSpan={this.state.remainedBillsToggle ? '14' : '12'}
              >
                <Pagination
                  className="norm-latin ltr"
                  defaultActivePage={this.state.activePage}
                  onPageChange={this.changePage}
                  firstItem={null}
                  lastItem={null}
                  totalPages={Math.ceil(Number(this.props.allBills.count) / 25)}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        ) : null}
      </Table>
    )
  }

  render() {
    return (
      <React.Fragment>
        <Segment stacked className="text-right us-fm-segment">
          <Checkbox
            toggle
            className="us-fm-toggle"
            onClick={this.handleToggleClick}
          />
          <span className="us-fm-span">نمایش فاکتورهای باقی مانده</span>
        </Segment>
        {this.state.fetch ? this.createTable() : <LoadingBar />}
        {this.state.fetch && !this.props.allBills.count ? <NotFound /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allBills: state.customers.allBills,
    remainedBills: state.customers.remainedBills,
  }
}

export default connect(mapStateToProps, {
  getAllBills,
  getRemainedBills,
  deleteBill,
})(FactorsTab)
