import React from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Pagination, Search, Table } from 'semantic-ui-react'
import {
  getProductsByCode,
  getProductsByFilter,
  getProductsList,
} from '../../actions/DepositoryActions'
import history from '../../history'
import LoadingBar from '../utils/loadingBar'
import NotFound from '../utils/notFound'
import { digitToComma } from '../utils/numberUtils'
import TableLabel from '../utils/tableLabelGenerator'

class ProductTable extends React.Component {
  state = {
    productsList: [],
    totalPageCount: 1,
    activePage: 1,
    notFound: false,
    width: 0,
    customers: [],
  }

  componentDidMount() {
    this.getProductsList()
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.productsList && newProps.productsList.results) {
      this.setState({
        nextPageUrl: newProps.productsList.next,
        activePage: !!newProps?.productsList.previous
          ? this.state.activePage
          : 1,
        notFound: false,
        productsList: newProps.productsList.results,
        totalPageCount: newProps.productsList
          ? Math.ceil(newProps.productsList.count / 25)
          : 1,
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  getProductsByFilter = (_filter = {}, _page = 1) => {
    this.props.getProductsByFilter({ ..._filter, page: _page }).then(() => {
      this.setState({
        notFound: false,
        productsList: this.props.productsList.results,
        totalPageCount: this.props.productsList
          ? Math.ceil(this.props.productsList.count / 25)
          : 1,
      })
    })
  }
  getProductsList = (page = 1) => {
    this.props.getProductsList(page).then(() => {
      this.setState({
        notFound: false,
        productsList: this.props.productsList.results,
        totalPageCount: this.props.productsList
          ? Math.ceil(this.props.productsList.count / 25)
          : 1,
      })
    })
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth })
  }

  getParamsAsJSON = (_path) => {
    const getLocationPath = (_path) => {
      return String(_path).split('?')?.[1]
    }
    var search = getLocationPath(_path)
    const _JSON = JSON.parse(
      '{"' +
        decodeURI(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
    )
    return _JSON
  }

  changePage = (_, { activePage }) => {
    this.setState({ activePage })
    if (String(this.state.nextPageUrl).includes('/filter/')) {
      const filterParams = this.getParamsAsJSON(this.state.nextPageUrl)
      this.getProductsByFilter(filterParams, activePage)
    } else {
      this.getProductsList(activePage)
    }
  }

  handleSearchChange = (_, { value }) => {
    this.setState({ searchLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) {
        this.getProductsList(this.state.activePage)
      } else {
        this.props
          .getProductsByCode(this.state.value)
          .then(() => {
            this.setState({
              notFound: false,
              productsList: [this.props.productsList],
              totalPageCount: 1,
            })
          })
          .catch(() => {
            this.setState({ notFound: true, noResult: true, productsList: [] })
          })
      }
      this.setState({
        searchLoading: false,
      })
    }, 300)
  }

  searchBar = () => {
    return (
      <Search
        input={{ icon: 'search', iconPosition: 'left' }}
        loading={this.state.searchLoading}
        showNoResults={false}
        placeholder="کد محصول را وارد نمایید"
        className="placeholder-rtl yekan ltr"
        onSearchChange={this.handleSearchChange}
        style={{ marginRight: '10px' }}
      />
    )
  }

  render() {
    return (
      <div>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                colSpan={this.props.edit ? '10' : '9'}
                className="rtl text-right"
              >
                <Grid>
                  <Grid.Row>
                    <h3 className="yekan" style={{ margin: '0 20px 0 0' }}>
                      لیست محصولات موجود
                    </h3>
                    {this.searchBar()}
                  </Grid.Row>
                </Grid>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {this.state.productsList.length > 0 ? (
            <React.Fragment>
              <Table.Header>
                <Table.Row>
                  {this.props.edit ? (
                    <Table.HeaderCell className="text-center">
                      عملیات
                    </Table.HeaderCell>
                  ) : null}
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={9}>رنگ پس زمینه</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={8}>رنگ طرح</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={7}>جنس</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={6}>نوع پارچه</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={5}>نوع طرح</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={4}>مقدار باقی مانده</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={3}>قیمت فروش</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={2}>نام محصول</TableLabel>
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-center">
                    <TableLabel count={1}>کد محصول</TableLabel>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.state.productsList.map((item, index) => {
                  return (
                    <Table.Row key={index}>
                      {this.props.edit ? (
                        <Table.Cell className="text-center">
                          <Button
                            color="teal"
                            onClick={() =>
                              history.push(
                                `/depository/depository-edit/${item.code}/${item.pk}/`
                              )
                            }
                          >
                            <span>ویرایش</span>
                          </Button>
                        </Table.Cell>
                      ) : null}
                      <Table.Cell className="norm-latin text-center">
                        <TableLabel count={9}>
                          <span className="yekan">
                            {item.background_color &&
                              item.background_color.name}
                          </span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center">
                        <TableLabel count={8}>
                          <span className="yekan">
                            {item.design_color && item.design_color.name}
                          </span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center">
                        <TableLabel count={7}>
                          <span className="yekan">
                            {item.material && item.material.name}
                          </span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center">
                        <TableLabel count={6}>
                          <span className="yekan">
                            {item.f_type && item.f_type.name}
                          </span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center">
                        <TableLabel count={5}>
                          <span className="yekan">
                            {item.design && item.design.name}
                          </span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center ltr">
                        <TableLabel count={4}>
                          <span className="yekan">متر</span>
                          <span>&nbsp;</span>
                          <span>{item.stock_amount}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="norm-latin text-center rtl">
                        <TableLabel count={3}>
                          <span className="yekan">تومان</span>
                          <span>{digitToComma(item.selling_price)}</span>{' '}
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell className="yekan text-center">
                        <TableLabel count={2}>
                          <span>{item.name}</span>
                        </TableLabel>
                      </Table.Cell>
                      <Table.Cell
                        className="norm-latin text-center"
                        textAlign="right"
                      >
                        <TableLabel count={1}>
                          <span>{item.code}</span>
                        </TableLabel>
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </React.Fragment>
          ) : (
            <NotFound />
          )}

          <Table.Footer fullWidth hidden={this.state.totalPageCount < 2}>
            <Table.Row>
              <Table.HeaderCell
                colSpan="10"
                className="norm-latin"
                style={{ overflow: 'scroll', maxWidth: this.state.width / 2 }}
              >
                <Pagination
                  className="norm-latin"
                  defaultActivePage={1}
                  activePage={this.state.activePage}
                  onPageChange={this.changePage}
                  totalPages={this.state.totalPageCount}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        {!this.props.productsList ? <LoadingBar /> : null}
        {this.props.productsList && this.props.productsList.count === 0 ? (
          <NotFound />
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    productsList: state.depository.productsList,
  }
}

export default connect(mapStateToProps, {
  getProductsList,
  getProductsByCode,
  getProductsByFilter,
})(ProductTable)
