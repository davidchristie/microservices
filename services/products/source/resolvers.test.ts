import faker from "faker";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts
} from "./repositories/products";
import resolvers from "./resolvers";

jest.mock("./repositories/products", () => ({
  createProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getProduct: jest.fn(),
  getProducts: jest.fn()
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("createProduct mutation resolver", () => {
  it("calls createProduct function", async () => {
    const name = faker.commerce.product();
    await resolvers.Mutation.createProduct(undefined, {
      name
    });
    expect(createProduct).toHaveBeenCalledTimes(1);
    expect(createProduct).toBeCalledWith({
      name
    });
  });
});

describe("deleteProduct mutation resolver", () => {
  it("calls deleteProduct function", async () => {
    const id = faker.random.uuid();
    await resolvers.Mutation.deleteProduct(undefined, {
      id
    });
    expect(deleteProduct).toHaveBeenCalledTimes(1);
    expect(deleteProduct).toBeCalledWith({
      id
    });
  });
});

describe("getProduct query resolver", () => {
  it("calls getProduct function", async () => {
    const id = faker.random.uuid();
    await resolvers.Query.getProduct(undefined, {
      id
    });
    expect(getProduct).toHaveBeenCalledTimes(1);
    expect(getProduct).toBeCalledWith({
      id
    });
  });
});

describe("getProducts query resolver", () => {
  it("calls getProducts function", async () => {
    await resolvers.Query.getProducts();
    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getProducts).toBeCalledWith();
  });
});

describe("Product reference resolver", () => {
  it("calls getProduct function", async () => {
    const id = faker.random.uuid();
    await resolvers.Product.__resolveReference({
      id
    });
    expect(getProduct).toHaveBeenCalledTimes(1);
    expect(getProduct).toBeCalledWith({
      id
    });
  });
});
