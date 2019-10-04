import { gql } from "apollo-server";

export default gql`
  enum ProductField {
    name
  }

  enum SortOrder {
    ASC
    DESC
  }

  input ProductFilter {
    name: String
    q: String
  }

  extend type Mutation {
    createProduct(name: String!): Product!
    deleteProduct(id: ID!): Product!
  }

  extend type Query {
    allProducts(
      filter: ProductFilter
      page: Int!
      perPage: Int!
      sortField: ProductField!
      sortOrder: SortOrder!
    ): [Product!]!
    Product(id: ID!): Product!
    _allProductsMeta(
      filter: ProductFilter
      page: Int
      perPage: Int
    ): ProductListMeta!
  }

  type ProductListMeta {
    count: Int!
  }

  type Product @key(fields: "id") {
    id: String!
    name: String!
    price: Int
    weight: Int
  }
`;
