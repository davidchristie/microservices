import faker from "faker";
import * as data from "../data";
import * as core from ".";
import { GetProductsInput } from "./types";

jest.mock("../data", () => ({
  createProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getProduct: jest.fn(),
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

  it("returns the number of products", async () => {
    (data.getProducts as jest.Mock).mockResolvedValueOnce(products);
    const count = await core.getProductCount();
    expect(data.getProducts).toHaveBeenCalledTimes(1);
    expect(data.getProducts).toBeCalledWith({
      sortField: "name",
      sortOrder: "ASC"
    });
    expect(count).toBe(products.length);
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
    const input: GetProductsInput = { sortField: "name", sortOrder: "ASC" };
    const output = await core.getProducts(input);
    expect(data.getProducts).toHaveBeenCalledTimes(1);
    expect(data.getProducts).toBeCalledWith(input);
    expect(output).toBe(products);
  });
});
