const { client } = require("./gateway");

const ALL_PRODUCTS_QUERY = `
  query {
    allProducts {
      id
      name
    }
  }
`;
const CREATE_PRODUCT_MUTATION = `
  mutation($name: String!) {
    createProduct(name: $name) {
      id
      name
    }
  }
`;
const DELETE_PRODUCT_MUTATION = `
  mutation($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;
const PRODUCT_QUERY = `
  query($id: ID!) {
    Product(id: $id) {
      id
      name
    }
  }
`;

const allProductsQuery = () => {
  return client.request(ALL_PRODUCTS_QUERY);
};

const createProductMutation = ({ name }) => {
  return client.request(CREATE_PRODUCT_MUTATION, {
    name
  });
};

const deleteProductMutation = ({ id }) => {
  return client.request(DELETE_PRODUCT_MUTATION, {
    id
  });
};

const productQuery = ({ id, name }) => {
  return client.request(PRODUCT_QUERY, {
    id,
    name
  });
};

module.exports = {
  allProductsQuery,
  createProductMutation,
  deleteProductMutation,
  productQuery
};
