import faker from "faker";
import { Driver } from "neo4j-driver/types/v1";
import { Product } from "../types";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts
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
    let product: Product | null;
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
    let product: Product | null;
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
      product = await getProduct({ id });
    });

    it("returns null", () => {
      expect(product).toBeNull();
    });

    it("closes the session", () => {
      expect(session.close).toHaveBeenCalledTimes(1);
    });
  });
});

describe("getProducts function", () => {
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
    products = await getProducts();
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
