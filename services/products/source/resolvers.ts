import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts
} from "./repositories/products";

const resolvers = {
  Mutation: {
    async createProduct(_, { name }) {
      return createProduct({ name });
    },
    async deleteProduct(_, { id }) {
      return deleteProduct({ id });
    }
  },
  Product: {
    async __resolveReference(object) {
      return getProduct({ id: object.id });
    }
  },
  Query: {
    async getProduct(_, { id }) {
      return getProduct({ id });
    },
    async getProducts() {
      return getProducts();
    }
  }
};

export default resolvers;
