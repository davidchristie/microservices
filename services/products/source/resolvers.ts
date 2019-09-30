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
      const product = await getProduct({ id });
      await deleteProduct({ id });
      return product;
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
