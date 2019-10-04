import uuid from "uuid/v4";
import { createDriver } from "../../neo4j";
import { Product } from "../../types";
import { buildProductSearchPlan, buildProductCountPlan } from "./plans";

interface GetProductCountInput {
  filter: {
    name?: string;
  };
  search?: string;
}

interface GetProductsInput {
  filter: {
    name?: string;
  };
  limit: number;
  search?: string;
  skip: number;
  sortField: "name";
  sortOrder: "ASC" | "DESC";
}

const driver = createDriver();

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

export const getProductCount = async ({
  filter,
  search
}: GetProductCountInput): Promise<number> => {
  const session = driver.session();
  const result = await session.run(buildProductCountPlan({ filter, search }), {
    search: search ? `*${search}*` : undefined
  });
  session.close();
  const count = result.records[0].get("count");
  return count.toNumberOrInfinity();
};

export const getProducts = async ({
  filter,
  skip,
  limit,
  search,
  sortField,
  sortOrder
}: GetProductsInput): Promise<Product[]> => {
  const session = driver.session();
  const plan = buildProductSearchPlan({
    filter,
    search,
    sortField,
    sortOrder
  });
  const result = await session.run(plan, {
    search: search ? `*${search}*` : undefined,
    skip,
    limit
  });
  session.close();
  return result.records.map(record => {
    return record.get("products").properties;
  });
};
