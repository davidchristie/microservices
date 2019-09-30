import uuid from "uuid/v4";
import { createDriver } from "../neo4j";
import { Product } from "../types";

const driver = createDriver();

export async function createProduct({ name }): Promise<Product> {
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
}

export async function deleteProduct({ id }): Promise<void> {
  const session = driver.session();
  await session.run("MATCH (p:Product { id: $id }) DELETE p", {
    id
  });
  session.close();
}

export async function getProduct({ id }): Promise<Product | null> {
  const session = driver.session();
  const result = await session.run(
    "MATCH (p:Product { id: $id }) RETURN p AS product LIMIT 1",
    {
      id
    }
  );
  session.close();
  const exists = result.records.length > 0;
  return exists ? result.records[0].get("product").properties : null;
}

export async function getProducts(): Promise<Product[]> {
  const session = driver.session();
  const result = await session.run("MATCH (p:Product) RETURN p AS products");
  session.close();
  return result.records.map(record => {
    return record.get("products").properties;
  });
}
