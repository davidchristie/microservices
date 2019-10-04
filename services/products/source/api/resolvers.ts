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
    allProducts(_, { filter, page, perPage, sortField, sortOrder }) {
      const { q: productSearch = undefined, ...productFilter } = filter || {};
      return core.getProducts({
        filter: productFilter,
        page,
        perPage,
        search: productSearch,
        sortField,
        sortOrder
      });
    },
    Product(_, { id }) {
      return core.getProduct({ id });
    },
    async _allProductsMeta(_, { filter }) {
      const { q: productSearch = undefined, ...productFilter } = filter || {};
      return {
        count: await core.getProductCount({
          filter: productFilter,
          search: productSearch
        })
      };
    }
  }
};

export default resolvers;
