import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getSuppliersAction,
  getSupplierBySearch
} from "../../actions/SuppliersActions";
import {
  Table,
  Grid,
  Search,
  Button,
  Pagination,
  Container,
  Segment
} from "semantic-ui-react";
import history from "../../history";
import TableLabel from "../utils/tableLabelGenerator";
import AddSupplierModal from "./AddSupplierModal";
import NotFound from "../utils/notFound";
import LoadingBar from "../utils/loadingBar";

const Suppliers = () => {
  const [fetch, setFetch] = useState(false);
  const [open, setOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [pk, setPk] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [value, setValue] = useState(null);

  const suppliers = useSelector(state => state.suppliers.suppliers);
  const newSupplier = useSelector(state =>
    state.suppliers.newSupplier ? state.suppliers.newSupplier.pk : { pk: 0 }
  );
  const dispatch = useDispatch();

  useEffect(() => {
    getSuppliers();
  }, [fetch]);

  const getSuppliers = (page = 1) => {
    dispatch(getSuppliersAction(page)).then(() => {
      setFetch(true);
      console.log(suppliers && suppliers.results);
    });
  };

  const changePage = (_, { activePage }) => {
    setActivePage(activePage);
    dispatch(getSuppliersAction(activePage));
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (_, { value }) => {
    setSearchLoading(true);
    setValue(value);

    setTimeout(() => {
      if (value.length < 1) {
        dispatch(getSuppliers(activePage));
      } else {
        dispatch(getSupplierBySearch(value)).then(() => {
          fetch(true);
        });
      }
      setSearchLoading(false);
    }, 300);
  };

  return (
    <Container>
      <AddSupplierModal open={open} onClose={onClose} />
      <Segment stacked className="rtl">
        <h2 className="yekan s-h2-padding">تامین کنندگان</h2>
      </Segment>
      <Table celled className="rtl text-center" columns={6}>
        <Table.Header className="text-right">
          <Table.Row>
            <Table.HeaderCell colSpan="9">
              <Grid stackable>
                <Grid.Column width={12}>
                  <Search
                    input={{ icon: "search", iconPosition: "left" }}
                    loading={searchLoading}
                    showNoResults={false}
                    placeholder="جست و جو..."
                    className="placeholder-rtl yekan rtl"
                    id="text-right"
                    onSearchChange={handleSearchChange}
                  />
                </Grid.Column>
                <Grid.Column width={4}>
                  <Button
                    className="yekan"
                    onClick={() => setOpen(true)}
                    color="green"
                    content="افزودن تامین کننده جدید"
                    icon="add"
                    labelPosition="right"
                    style={{ fontSize: "13.8px" }}
                  />
                </Grid.Column>
              </Grid>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {suppliers && suppliers.results.length ? (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ borderLeft: "1px solid #ddd" }}>
                <TableLabel>1</TableLabel>
                کد تامین کننده
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>2</TableLabel>
                نام فروشگاه
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>3</TableLabel>
                نام مدیریت
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>4</TableLabel>
                نام خانوادگی مدیریت
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>5</TableLabel>
                شماره تلفن
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>6</TableLabel>
                شماره موبایل
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>7</TableLabel>
                ایمیل
              </Table.HeaderCell>
              <Table.HeaderCell>
                <TableLabel>8</TableLabel>
                آدرس
              </Table.HeaderCell>
              <Table.HeaderCell>عملیات</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        ) : null}

        {suppliers && suppliers.results.length
          ? suppliers.results.map(item => {
              return (
                <Table.Body>
                  <Table.Row key={item.pk}>
                    <Table.Cell
                      collapsing
                      style={{ borderLeft: "1px solid #ddd" }}
                    >
                      <TableLabel>1</TableLabel>
                      <span id="norm-latin">{item.pk}</span>
                    </Table.Cell>
                    <Table.Cell collapsing>
                      <TableLabel>2</TableLabel>
                      <span className="yekan">{item.store}</span>
                    </Table.Cell>
                    <Table.Cell collapsing className="norm-latin">
                      <TableLabel>3</TableLabel>
                      <span className="yekan">{item.first_name}</span>
                    </Table.Cell>
                    <Table.Cell collapsing className="norm-latin">
                      <TableLabel>4</TableLabel>
                      <span className="yekan">{item.last_name}</span>
                    </Table.Cell>
                    <Table.Cell collapsing>
                      <TableLabel>5</TableLabel>
                      <span id="norm-latin">{item.phone_number}</span>
                    </Table.Cell>
                    <Table.Cell collapsing>
                      <TableLabel>6</TableLabel>
                      <span id="norm-latin">{item.mobile_number}</span>
                    </Table.Cell>
                    <Table.Cell collapsing>
                      <TableLabel>7</TableLabel>
                      <span id="norm-latin">{item.email}</span>
                    </Table.Cell>
                    <Table.Cell collapsing>
                      <TableLabel>8</TableLabel>
                      <span className="yekan">{item.address}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        className="yekan"
                        content="نمایه"
                        labelPosition="right"
                        color="teal"
                        icon="address card"
                        onClick={() => {
                          setPk(pk);
                          history.push(`/suppliers/edit-supplier/${item.pk}/`);
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })
          : null}
        {!fetch ? <LoadingBar /> : null}
        {fetch && !suppliers.results.length ? <NotFound /> : null}

        {suppliers && suppliers.results.count > 25 ? (
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="6">
                <Pagination
                  className="norm-latin ltr"
                  defaultActivePage={1}
                  onPageChange={changePage}
                  firstItem={null}
                  lastItem={null}
                  totalPages={Math.ceil(suppliers.results.count / 25)}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        ) : null}
      </Table>
    </Container>
  );
};

export default Suppliers;
