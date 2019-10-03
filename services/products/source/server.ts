import { buildFederatedSchema } from "@apollo/federation";
import { ApolloServer, gql } from "apollo-server";
import resolvers from "./resolvers";

const typeDefs = gql`
  enum ProductField {
    name
  }

  enum SortOrder {
    ASC
    DESC
  }

  extend type Mutation {
    createProduct(name: String!): Product!
    deleteProduct(id: ID!): Product!
  }

  extend type Query {
    allProducts(sortField: ProductField!, sortOrder: SortOrder!): [Product!]!
    Product(id: ID!): Product!
    _allProductsMeta: ProductListMeta!
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

const server = new ApolloServer({
  debug: process.env.NODE_ENV !== "production",
  schema: buildFederatedSchema([
    {
      resolvers,
      typeDefs
    }
  ])
});

export default server;
