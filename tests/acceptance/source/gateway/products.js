const { client } = require("./gateway");

const CREATE_PRODUCT_MUTATION = `
  mutation($name: String!) {
    createProduct(name: $name) {
      id
      name
    }
  }
`;
const DELETE_ID_MUTATION = `
  mutation($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;
const GET_PRODUCT_QUERY = `
  query($id: ID!) {
    getProduct(id: $id) {
      id
      name
    }
  }
`;
const GET_PRODUCTS_QUERY = `
  query {
    getProducts {
      id
      name
    }
  }
`;

const createProduct = ({ name }) => {
  return client.request(CREATE_PRODUCT_MUTATION, {
    name
  });
};

const deleteProduct = ({ id }) => {
  return client.request(DELETE_PRODUCT_MUTATION, {
    id
  });
};

const getProduct = ({ id, name }) => {
  return client.request(GET_PRODUCT_QUERY, {
    id,
    name
  });
};

const getProducts = () => {
  return client.request(GET_PRODUCTS_QUERY);
};

module.exports = {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts
};
