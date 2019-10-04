import * as data from "../data";

export interface CreateProductInput {
  name: string;
}

export interface DeleteProductInput {
  id: string;
}

export interface GetProductCountInput {
  filter: ProductFilter;
  search?: string;
}

export interface GetProductsInput {
  filter: ProductFilter;
  page: number;
  perPage: number;
  search?: string;
  sortField: "name";
  sortOrder: "ASC" | "DESC";
}

export type Product = data.Product;

export interface ProductFilter {
  name?: string;
}
