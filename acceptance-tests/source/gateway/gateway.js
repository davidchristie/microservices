const { GraphQLClient } = require("graphql-request");

const GATEWAY_HOST = process.env.GATEWAY_HOST || "http://localhost:4000";

const client = new GraphQLClient(`${GATEWAY_HOST}/graphql`);

module.exports = {
  client
};
