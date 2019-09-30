import { client } from "./gateway";

const CREATE_TOKEN_MUTATION = `
  mutation($email: String!, $password: String!) {
    createToken(email: $email, password: $password)
  }
`;
const CREATE_USER_MUTATION = `
  mutation($email: String!, $name: String!, $password: String!) {
    createUser(email: $email, name: $name, password: $password) {
      email
      id
      name
    }
  }
`;

const createToken = ({ email, password }) => {
  return client.request(CREATE_TOKEN_MUTATION, {
    email,
    password
  });
};

const createUser = ({ email, name, password }) => {
  return client.request(CREATE_USER_MUTATION, {
    email,
    name,
    password
  });
};

module.exports = {
  createToken,
  createUser
};
