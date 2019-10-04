import { ApolloServer } from "apollo-server-express";
import { createServer } from ".";

describe("createServer function", () => {
  it("returns ApolloServer instance", () => {
    expect(createServer()).toBeInstanceOf(ApolloServer);
  });
});
