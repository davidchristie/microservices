import { buildFederatedSchema } from "@apollo/federation";
import { ApolloServer } from "apollo-server";
import resolvers from "./resolvers";
import schema from "./schema";

export const createServer = () => {
  return new ApolloServer({
    debug: process.env.NODE_ENV !== "production",
    schema: buildFederatedSchema([
      {
        resolvers,
        typeDefs: schema
      }
    ])
  });
};
