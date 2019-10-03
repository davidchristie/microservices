import {
  allProducts,
  createProduct,
  deleteProduct,
  getProduct
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
    async allProducts(_, { sortField, sortOrder }) {
      return allProducts({ sortField, sortOrder });
    },
    async Product(_, { id }) {
      return getProduct({ id });
    },
    async _allProductsMeta() {
      const products = await allProducts();
      return {
        count: products.length
      };
    }
  }
};

export default resolvers;
