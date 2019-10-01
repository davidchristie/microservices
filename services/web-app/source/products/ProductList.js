import BookIcon from "@material-ui/icons/Book";
import Chip from "@material-ui/core/Chip";
import { withStyles } from "@material-ui/core/styles";
import React, { Children, Fragment, cloneElement } from "react";
import lodashGet from "lodash/get";
import { unparse as convertToCSV } from "papaparse/papaparse.min";
import {
  BooleanField,
  BulkDeleteButton,
  ChipField,
  Datagrid,
  DateField,
  downloadCSV,
  EditButton,
  Filter,
  List,
  NumberField,
  ReferenceArrayField,
  Responsive,
  SearchInput,
  ShowButton,
  SimpleList,
  SingleFieldList,
  TextField,
  TextInput,
  translate
} from "react-admin"; // eslint-disable-line import/no-unresolved

import ResetViewsButton from "./ResetViewsButton";
export const ProductIcon = BookIcon;

const QuickFilter = translate(({ label, translate }) => (
  <Chip style={{ marginBottom: 8 }} label={translate(label)} />
));

const ProductFilter = props => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <TextInput source="name" defaultValue="Qui tempore rerum et voluptates" />
    <QuickFilter
      label="resources.posts.fields.commentable"
      source="commentable"
      defaultValue
    />
  </Filter>
);

const exporter = posts => {
  const data = posts.map(post => ({
    ...post,
    backlinks: lodashGet(post, "backlinks", []).map(backlink => backlink.url)
  }));
  return downloadCSV(convertToCSV({ data }), "posts");
};

const styles = theme => ({
  name: {
    maxWidth: "20em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  hiddenOnSmallScreens: {
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  },
  publishedAt: { fontStyle: "italic" }
});

const ProductListBulkActions = props => (
  <Fragment>
    <ResetViewsButton {...props} />
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
  <div dangerouslySetInnerHTML={{ __html: record.body }} />
);

const ProductList = withStyles(styles)(({ classes, ...props }) => (
  <List
    {...props}
    bulkActionButtons={<ProductListBulkActions />}
    filters={<ProductFilter />}
    sort={{ field: "published_at", order: "DESC" }}
    exporter={exporter}
  >
    <Responsive
      small={
        <SimpleList
          primaryText={record => record.name}
          secondaryText={record => `${record.views} views`}
          tertiaryText={record =>
            new Date(record.published_at).toLocaleDateString()
          }
        />
      }
      medium={
        <Datagrid rowClick={rowClick} expand={<ProductPanel />}>
          <TextField source="id" />
          <TextField source="name" cellClassName={classes.name} />
          <DateField
            source="published_at"
            cellClassName={classes.publishedAt}
          />

          <BooleanField
            source="commentable"
            label="resources.posts.fields.commentable_short"
            sortable={false}
          />
          <NumberField source="views" />
          <ReferenceArrayField
            label="Tags"
            reference="tags"
            source="tags"
            sortBy="tags.name"
            cellClassName={classes.hiddenOnSmallScreens}
            headerClassName={classes.hiddenOnSmallScreens}
          >
            <SingleFieldList>
              <ChipField source="name" />
            </SingleFieldList>
          </ReferenceArrayField>
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
