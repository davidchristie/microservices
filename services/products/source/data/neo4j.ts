import neo4j from "neo4j-driver";
import { Driver } from "neo4j-driver/types/v1";

export const createDriver = (): Driver => {
  const url = process.env.NEO4J_HOST || "bolt://products-neo4j:7687";
  const user = process.env.NEO4J_USERNAME || "neoj4";
  const password = process.env.NEO4J_PASSWORD || "products";
  return neo4j.driver(url, neo4j.auth.basic(user, password));
};
