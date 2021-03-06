import faker from "faker";
import * as data from "../data";
import * as core from ".";
import { GetProductsInput } from "./types";

jest.mock("../data", () => ({
  createProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getProduct: jest.fn(),
  getProductCount: jest.fn(),
  getProducts: jest.fn()
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("createProduct core function", () => {
  it("delegates to createProduct data function", async () => {
    const name = faker.commerce.product();
    const createdProduct = {
      id: faker.random.uuid(),
      name
    };
    (data.createProduct as jest.Mock).mockResolvedValueOnce(createdProduct);
    const output = await core.createProduct({
      name
    });
    expect(data.createProduct).toHaveBeenCalledTimes(1);
    expect(data.createProduct).toBeCalledWith({
      name
    });
    expect(output).toBe(createdProduct);
  });
});

describe("deleteProduct core function", () => {
  describe("when product exists", () => {
    let id: string;
    let product: data.Product;
    let output: core.Product;

    beforeEach(async () => {
      id = faker.random.uuid();
      product = {
        id,
        name: faker.random.uuid()
      };
      (data.getProduct as jest.Mock).mockResolvedValueOnce(product);
      output = await core.deleteProduct({
        id
      });
    });

    it("calls deleteProduct data function", async () => {
      expect(data.deleteProduct).toHaveBeenCalledTimes(1);
      expect(data.deleteProduct).toBeCalledWith({
        id
      });
    });

    it("returns the deleted product", () => {
      expect(output).toEqual(product);
    });
  });

  describe("when product does not exist", () => {
    beforeEach(async () => {
      (data.getProduct as jest.Mock).mockResolvedValueOnce(null);
    });

    it("throws an error", async () => {
      await expect(
        core.getProduct({ id: faker.random.uuid() })
      ).rejects.toEqual(new Error("Product does not exist."));
    });
  });
});

describe("getProduct core function", () => {
  describe("when product exists", () => {
    let id: string;
    let product: data.Product;

    beforeEach(() => {
      id = faker.random.uuid();
      product = {
        id,
        name: faker.commerce.product()
      };
      (data.getProduct as jest.Mock).mockResolvedValueOnce(product);
    });

    it("returns the specified product", async () => {
      await expect(
        core.getProduct({
          id
        })
      ).resolves.toBe(product);
    });
  });

  describe("when product does not exist", () => {
    beforeEach(() => {
      (data.getProduct as jest.Mock).mockResolvedValueOnce(null);
    });

    it("throws an error", async () => {
      await expect(
        core.getProduct({ id: faker.random.uuid() })
      ).rejects.toEqual(new Error("Product does not exist."));
    });
  });
});

describe("getProductCount core function", () => {
  let count: number;

  beforeEach(() => {
    count = faker.random.number();
  });

  it("returns the number of products", async () => {
    (data.getProductCount as jest.Mock).mockResolvedValueOnce(count);
    const input = {
      filter: {
        name: faker.commerce.productName()
      },
      search: faker.commerce.product()
    };
    const output = await core.getProductCount(input);
    expect(data.getProductCount).toHaveBeenCalledTimes(1);
    expect(data.getProductCount).toBeCalledWith(input);
    expect(output).toBe(count);
  });
});

describe("getProducts core function", () => {
  const products = [
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

  it("delegates to getProducts data function", async () => {
    (data.getProducts as jest.Mock).mockResolvedValueOnce(products);
    const input: GetProductsInput = {
      filter: {
        name: faker.commerce.productName()
      },
      page: faker.random.number(),
      perPage: faker.random.number(),
      search: faker.commerce.product(),
      sortField: "name",
      sortOrder: faker.random.arrayElement(["ASC", "DESC"])
    };
    const output = await core.getProducts(input);
    expect(data.getProducts).toHaveBeenCalledTimes(1);
    expect(data.getProducts).toBeCalledWith({
      filter: input.filter,
      skip: input.page * input.perPage,
      limit: input.perPage,
      search: input.search,
      sortField: "name",
      sortOrder: input.sortOrder
    });
    expect(output).toBe(products);
  });
});
