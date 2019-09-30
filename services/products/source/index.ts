import { buildFederatedSchema } from "@apollo/federation";
import { ApolloServer, gql } from "apollo-server";
import resolvers from "./resolvers";

const typeDefs = gql`
  extend type Mutation {
    createProduct(name: String!): Product!
    deleteProduct(id: String!): Product!
  }

  extend type Query {
    getProduct(id: ID): Product!
    getProducts: [Product]
  }

  type Product @key(fields: "id") {
    upc: String!
    name: String
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

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const products = [
  {
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100
  },
  {
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000
  },
  {
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50
  }
];
