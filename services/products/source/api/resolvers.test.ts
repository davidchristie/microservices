import faker from "faker";
import * as core from "../core";
import resolvers from "./resolvers";

jest.mock("../core", () => ({
  createProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getProduct: jest.fn(),
  getProductCount: jest.fn(),
  getProducts: jest.fn()
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("allProducts query resolver", () => {
  it("delegates to getProducts core function", async () => {
    const queriedProducts = [
      {
        id: faker.random.uuid()
      },
      {
        id: faker.random.uuid()
      },
      {
        id: faker.random.uuid()
      }
    ];
    (core.getProducts as jest.Mock).mockResolvedValueOnce(queriedProducts);
    const input = { page: 3, perPage: 10, sortField: "name", sortOrder: "ASC" };
    const output = await resolvers.Query.allProducts({}, input);
    expect(core.getProducts).toHaveBeenCalledTimes(1);
    expect(core.getProducts).toBeCalledWith(input);
    expect(output).toBe(queriedProducts);
  });
});

describe("createProduct mutation resolver", () => {
  it("delegates to createProduct core function", async () => {
    const name = faker.commerce.product();
    const createdProduct = {
      id: faker.random.uuid(),
      name
    };
    (core.createProduct as jest.Mock).mockResolvedValueOnce(createdProduct);
    const output = await resolvers.Mutation.createProduct(undefined, {
      name
    });
    expect(core.createProduct).toHaveBeenCalledTimes(1);
    expect(core.createProduct).toBeCalledWith({
      name
    });
    expect(output).toBe(createdProduct);
  });
});

describe("deleteProduct mutation resolver", () => {
  it("delegates to deleteProduct core function", async () => {
    const id = faker.random.uuid();
    const deletedProduct = {
      id
    };
    (core.deleteProduct as jest.Mock).mockResolvedValueOnce(deletedProduct);
    const output = await resolvers.Mutation.deleteProduct(undefined, {
      id
    });
    expect(core.deleteProduct).toHaveBeenCalledTimes(1);
    expect(core.deleteProduct).toBeCalledWith({
      id
    });
    expect(output).toBe(deletedProduct);
  });
});

describe("Product query resolver", () => {
  it("delegates to getProduct core function", async () => {
    const id = faker.random.uuid();
    const queriedProduct = {
      id
    };
    (core.getProduct as jest.Mock).mockResolvedValueOnce(queriedProduct);
    const output = await resolvers.Query.Product(undefined, {
      id
    });
    expect(core.getProduct).toHaveBeenCalledTimes(1);
    expect(core.getProduct).toBeCalledWith({
      id
    });
    expect(output).toBe(queriedProduct);
  });
});

describe("Product reference resolver", () => {
  it("delegates to getProduct core function", async () => {
    const id = faker.random.uuid();
    const queriedProduct = {
      id
    };
    (core.getProduct as jest.Mock).mockResolvedValueOnce(queriedProduct);
    const output = await resolvers.Product.__resolveReference({
      id
    });
    expect(core.getProduct).toHaveBeenCalledTimes(1);
    expect(core.getProduct).toBeCalledWith({
      id
    });
    expect(output).toBe(queriedProduct);
  });
});

describe("_allProductsMeta query resolver", () => {
  it("delegates to getProductCount core function", async () => {
    const count = 3;
    (core.getProductCount as jest.Mock).mockResolvedValueOnce(count);
    const output = await resolvers.Query._allProductsMeta();
    expect(core.getProductCount).toHaveBeenCalledTimes(1);
    expect(core.getProductCount).toBeCalledWith();
    expect(output).toEqual({
      count
    });
  });
});
