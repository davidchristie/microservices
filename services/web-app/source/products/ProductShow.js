import { ShowController } from "ra-core";
import React from "react";
import {
  ArrayField,
  BooleanField,
  CloneButton,
  ChipField,
  Datagrid,
  DateField,
  EditButton,
  NumberField,
  ReferenceArrayField,
  ReferenceManyField,
  RichTextField,
  SelectField,
  ShowView,
  SingleFieldList,
  Tab,
  TabbedShowLayout,
  TextField,
  UrlField
} from "react-admin"; // eslint-disable-line import/no-unresolved
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import ProductTitle from "./ProductTitle";

const CreateRelatedComment = ({ record }) => (
  <Button
    component={Link}
    to={{
      pathname: "/comments/create",
      state: { record: { product_id: record.id } }
    }}
  >
    Add comment
  </Button>
);

const ProductShow = props => (
  <ShowController title={<ProductTitle />} {...props}>
    {controllerProps => (
      <ShowView {...props} {...controllerProps}>
        <TabbedShowLayout>
          <Tab label="product.form.summary">
            <TextField source="id" />
            <TextField source="title" />
            {controllerProps.record &&
              controllerProps.record.title ===
                "Fusce massa lorem, pulvinar a posuere ut, accumsan ac nisi" && (
                <TextField source="teaser" />
              )}
            <ArrayField source="backlinks">
              <Datagrid>
                <DateField source="date" />
                <UrlField source="url" />
              </Datagrid>
            </ArrayField>
          </Tab>
          <Tab label="product.form.body">
            <RichTextField
              source="body"
              stripTags={false}
              label=""
              addLabel={false}
            />
          </Tab>
          <Tab label="product.form.miscellaneous">
            <ReferenceArrayField reference="tags" source="tags">
              <SingleFieldList>
                <ChipField source="name" />
              </SingleFieldList>
            </ReferenceArrayField>
            <DateField source="published_at" />
            <SelectField
              source="category"
              choices={[
                { name: "Tech", id: "tech" },
                { name: "Lifestyle", id: "lifestyle" }
              ]}
            />
            <NumberField source="average_note" />
            <BooleanField source="commentable" />
            <TextField source="views" />
            <CloneButton />
          </Tab>
          <Tab label="product.form.comments">
            <ReferenceManyField
              addLabel={false}
              reference="comments"
              target="product_id"
              sort={{ field: "created_at", order: "DESC" }}
            >
              <Datagrid>
                <DateField source="created_at" />
                <TextField source="author.name" />
                <TextField source="body" />
                <EditButton />
              </Datagrid>
            </ReferenceManyField>
            <CreateRelatedComment />
          </Tab>
        </TabbedShowLayout>
      </ShowView>
    )}
  </ShowController>
);

export default ProductShow;
