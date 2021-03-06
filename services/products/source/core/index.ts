import * as data from "../data";
import {
  CreateProductInput,
  DeleteProductInput,
  GetProductCountInput,
  GetProductsInput,
  Product
} from "./types";

export * from "./types";

export function createProduct({ name }: CreateProductInput): Promise<Product> {
  return data.createProduct({ name });
}

export const deleteProduct = async ({
  id
}: DeleteProductInput): Promise<Product> => {
  const product = await getProduct({ id });
  await data.deleteProduct({ id });
  return product;
};

export const getProduct = async ({ id }): Promise<Product> => {
  const product = await data.getProduct({ id });
  if (product === null) {
    throw new Error("Product does not exist.");
  }
  return product;
};

export const getProducts = ({
  filter,
  page,
  perPage,
  search,
  sortField,
  sortOrder
}: GetProductsInput): Promise<Product[]> => {
  const skip = page * perPage;
  const limit = perPage;
  return data.getProducts({
    filter,
    skip,
    search,
    limit,
    sortField,
    sortOrder
  });
};

export const getProductCount = async ({
  filter,
  search
}: GetProductCountInput): Promise<number> => {
  return data.getProductCount({ filter, search });
};
