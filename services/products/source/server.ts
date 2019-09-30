import { buildFederatedSchema } from "@apollo/federation";
import { ApolloServer, gql } from "apollo-server";
import resolvers from "./resolvers";

const typeDefs = gql`
  extend type Mutation {
    createProduct(name: String!): Product!
    deleteProduct(id: ID!): Product!
  }

  extend type Query {
    getProduct(id: ID): Product!
    getProducts: [Product]
  }

  type Product @key(fields: "id") {
    id: String!
    name: String!
    price: Int
    weight: Int
  }
`;

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      resolvers,
      typeDefs
    }
  ])
});

export default server;
