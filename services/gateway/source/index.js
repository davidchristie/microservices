const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const { ApolloServer } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { getServiceList } = require("./data/services");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const createGateway = async () => {
  const serviceList = await getServiceList();
  console.log("Service list:", serviceList);
  return new ApolloGateway({
    buildService({ url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }) {
          request.http.headers.set("user-id", context.userID);
        }
      });
    },
    serviceList
  });
};

const getUserID = request => {
  const { token } = request.headers;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const { id } = decoded;
      return id;
    } catch (error) {}
  }
  return null;
};

(async () => {
  const gateway = await createGateway();
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({
    context: ({ req }) => ({
      userID: getUserID(req)
    }),
    executor,
    schema
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
