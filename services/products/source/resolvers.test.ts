import faker from "faker";
import {
  allProducts,
  createProduct,
  deleteProduct,
  getProduct
} from "./repositories/products";
import resolvers from "./resolvers";

jest.mock("./repositories/products", () => ({
  allProducts: jest.fn(),
  createProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getProduct: jest.fn()
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("allProducts query resolver", () => {
  it("calls allProducts function", async () => {
    const input = { sortField: "name", sortOrder: "ASC" };
    await resolvers.Query.allProducts({}, input);
    expect(allProducts).toHaveBeenCalledTimes(1);
    expect(allProducts).toBeCalledWith(input);
  });
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

describe("Product query resolver", () => {
  it("calls getProduct function", async () => {
    const id = faker.random.uuid();
    await resolvers.Query.Product(undefined, {
      id
    });
    expect(getProduct).toHaveBeenCalledTimes(1);
    expect(getProduct).toBeCalledWith({
      id
    });
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

describe("_allProductsMeta query resolver", () => {
  it("calls allProducts function", async () => {
    (allProducts as jest.Mock).mockResolvedValueOnce([
      {
        id: "PRODUCT_ID_1"
      },
      {
        id: "PRODUCT_ID_2"
      },
      {
        id: "PRODUCT_ID_3"
      }
    ]);
    await resolvers.Query._allProductsMeta();
    expect(allProducts).toHaveBeenCalledTimes(1);
    expect(allProducts).toBeCalledWith();
  });
});
