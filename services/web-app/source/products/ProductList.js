import BookIcon from "@material-ui/icons/Book";
import { withStyles } from "@material-ui/core/styles";
import React, { Children, Fragment, cloneElement } from "react";
import { unparse as convertToCSV } from "papaparse/papaparse.min";
import {
  BulkDeleteButton,
  Datagrid,
  downloadCSV,
  EditButton,
  Filter,
  List,
  Responsive,
  SearchInput,
  ShowButton,
  SimpleList,
  TextField,
  TextInput
} from "react-admin";

export const ProductIcon = BookIcon;

const ProductFilter = props => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <TextInput source="name" defaultValue="" />
  </Filter>
);

const exporter = products => {
  return downloadCSV(convertToCSV({ data: products }), "products");
};

const styles = theme => ({
  name: {
    maxWidth: "20em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
});

const ProductListBulkActions = props => (
  <Fragment>
    <BulkDeleteButton {...props} />
  </Fragment>
);

const ProductListActionToolbar = withStyles({
  toolbar: {
    alignItems: "center",
    display: "flex"
  }
})(({ classes, children, ...props }) => (
  <div className={classes.toolbar}>
    {Children.map(children, button => cloneElement(button, props))}
  </div>
));

const rowClick = (id, basePath, record) => {
  if (record.commentable) {
    return "edit";
  }
  return "show";
};

const ProductPanel = ({ id, record, resource }) => (
  <div>TODO: Expanded product panel.</div>
);

const ProductList = withStyles(styles)(({ classes, ...props }) => (
  <List
    {...props}
    bulkActionButtons={<ProductListBulkActions />}
    exporter={exporter}
    filters={<ProductFilter />}
    sort={{ field: "name", order: "ASC" }}
  >
    <Responsive
      small={
        <SimpleList
          primaryText={record => record.name}
          secondaryText={record => record.id}
        />
      }
      medium={
        <Datagrid rowClick={rowClick} expand={<ProductPanel />}>
          <TextField source="name" cellClassName={classes.name} />
          <ProductListActionToolbar>
            <EditButton />
            <ShowButton />
          </ProductListActionToolbar>
        </Datagrid>
      }
    />
  </List>
));

export default ProductList;
