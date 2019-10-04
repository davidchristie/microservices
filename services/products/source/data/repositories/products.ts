import uuid from "uuid/v4";
import { createDriver } from "../neo4j";
import { Product } from "../types";

interface GetProductsInput {
  sortField: "name";
  sortOrder: "ASC" | "DESC";
}

const PRODUCT_FIELDS = ["name"];

const SORT_ORDERS = ["ASC", "DESC"];

const driver = createDriver();

const validateProductField = (field: string): void => {
  if (!PRODUCT_FIELDS.includes(field)) {
    throw new Error("Invalid product field: " + field);
  }
};

const validateSortOrder = (order: string): void => {
  if (!SORT_ORDERS.includes(order)) {
    throw new Error("Invalid sort order: " + order);
  }
};

export const createProduct = async ({ name }): Promise<Product> => {
  const id = uuid();
  const newProduct: Product = {
    id,
    name
  };
  const session = driver.session();
  await session.run(
    "CREATE (p:Product { id: $id, name: $name }) RETURN p AS product",
    newProduct
  );
  session.close();
  return newProduct;
};

export const deleteProduct = async ({ id }): Promise<void> => {
  const session = driver.session();
  await session.run("MATCH (p:Product { id: $id }) DELETE p", {
    id
  });
  session.close();
};

export const getProduct = async ({ id }): Promise<Product | null> => {
  const session = driver.session();
  const result = await session.run(
    "MATCH (p:Product { id: $id }) RETURN p AS product LIMIT 1",
    {
      id
    }
  );
  session.close();
  const exists = result.records.length > 0;
  if (!exists) {
    return null;
  }
  return result.records[0].get("product").properties;
};

export const getProducts = async ({
  sortField,
  sortOrder
}: GetProductsInput): Promise<Product[]> => {
  validateProductField(sortField);
  validateSortOrder(sortOrder);
  const session = driver.session();
  const result = await session.run(
    `MATCH (p:Product) RETURN p AS products ORDER BY p.${sortField} ${sortOrder}`
  );
  session.close();
  return result.records.map(record => {
    return record.get("products").properties;
  });
};
