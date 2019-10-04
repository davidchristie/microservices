import { createServer } from "./api";

const server = createServer();

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
