import * as core from "../core";

const resolvers = {
  Mutation: {
    createProduct(_, { name }) {
      return core.createProduct({ name });
    },
    deleteProduct(_, { id }) {
      return core.deleteProduct({ id });
    }
  },
  Product: {
    __resolveReference(object) {
      return core.getProduct({ id: object.id });
    }
  },
  Query: {
    allProducts(_, { sortField, sortOrder }) {
      return core.getProducts({ sortField, sortOrder });
    },
    Product(_, { id }) {
      return core.getProduct({ id });
    },
    async _allProductsMeta() {
      return {
        count: await core.getProductCount()
      };
    }
  }
};

export default resolvers;
