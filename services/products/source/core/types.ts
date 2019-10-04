import * as data from "../data";

export interface CreateProductInput {
  name: string;
}

export interface DeleteProductInput {
  id: string;
}

export interface GetProductsInput {
  page: number;
  perPage: number;
  sortField: "name";
  sortOrder: "ASC" | "DESC";
}

export type Product = data.Product;
