import faker from "faker";
import { Driver } from "neo4j-driver/types/v1";
import { Product } from "../types";
import {
  createProduct,
  deleteProduct,
  getProduct,
  allProducts
} from "./products";

let driver: Driver;

jest.mock("../neo4j", () => {
  return {
    createDriver: () => {
      driver = {
        close: jest.fn(),
        session: jest.fn()
      };
      return driver;
    }
  };
});

describe("allProducts function", () => {
  describe("with valid input", () => {
    let products: Product[];
    let session: any;

    beforeEach(async () => {
      session = {
        close: jest.fn(),
        run: jest.fn()
      };
      (driver.session as any).mockReturnValueOnce(session);
      (session.run as any).mockReturnValueOnce({
        records: [
          {
            get: () => ({
              properties: {
                id: faker.random.uuid()
              }
            })
          },
          {
            get: () => ({
              properties: {
                id: faker.random.uuid()
              }
            })
          },
          {
            get: () => ({
              properties: {
                id: faker.random.uuid()
              }
            })
          }
        ]
      });
      products = await allProducts();
    });

    it("returns a list of products", () => {
      expect(products).toEqual([
        {
          id: expect.any(String)
        },
        {
          id: expect.any(String)
        },
        {
          id: expect.any(String)
        }
      ]);
    });

    it("closes the session", () => {
      expect(session.close).toHaveBeenCalledTimes(1);
    });
  });

  it("throws error if sortField is invalid", async () => {
    const sortField: any = "invalid_field";
    expect(allProducts({ sortField })).rejects.toThrowError(
      new Error("Invalid product field: " + sortField)
    );
  });

  it("throws error if sortOrder is invalid", () => {
    const sortOrder: any = "invalid_order";
    expect(allProducts({ sortOrder })).rejects.toThrowError(
      new Error("Invalid sort order: " + sortOrder)
    );
  });
});

describe("createProduct function", () => {
  let session: any;
  let name: string;
  let email: string;
  let product: Product;

  beforeEach(async () => {
    name = faker.commerce.product();
    session = {
      close: jest.fn(),
      run: jest.fn()
    };
    (driver.session as any).mockReturnValueOnce(session);
    product = await createProduct({ name });
  });

  it("returns a product", async () => {
    expect(product).toEqual({
      id: expect.any(String),
      name
    });
  });

  it("closes the session", () => {
    expect(session.close).toHaveBeenCalledTimes(1);
  });
});

describe("deleteProduct function", () => {
  let session: any;

  beforeEach(async () => {
    const id = faker.random.uuid();
    session = {
      close: jest.fn(),
      run: jest.fn()
    };
    (driver.session as any).mockReturnValueOnce(session);
    await deleteProduct({ id });
  });

  it("closes the session", () => {
    expect(session.close).toHaveBeenCalledTimes(1);
  });
});

describe("getProduct function", () => {
  describe("when product exists", () => {
    let id: string;
    let product: Product;
    let session: any;

    beforeEach(async () => {
      id = faker.random.uuid();
      session = {
        close: jest.fn(),
        run: jest.fn()
      };
      (driver.session as any).mockReturnValueOnce(session);
      (session.run as any).mockReturnValueOnce({
        records: [
          {
            get: () => ({
              properties: {
                id
              }
            })
          }
        ]
      });
      product = await getProduct({ id });
    });

    it("returns the specified product", () => {
      expect(product).toMatchObject({
        id
      });
    });

    it("closes the session", () => {
      expect(session.close).toHaveBeenCalledTimes(1);
    });
  });

  describe("when product does not exist", () => {
    let id: string;
    let getProductError: Error;
    let session: any;

    beforeEach(async () => {
      id = faker.random.uuid();
      session = {
        close: jest.fn(),
        run: jest.fn()
      };
      (driver.session as any).mockReturnValueOnce(session);
      (session.run as any).mockReturnValueOnce({
        records: []
      });
      try {
        await getProduct({ id });
      } catch (error) {
        getProductError = error;
      }
    });

    it("throws an error", () => {
      expect(getProductError).toEqual(new Error("Product does not exist."));
    });

    it("closes the session", () => {
      expect(session.close).toHaveBeenCalledTimes(1);
    });
  });
});
