import faker from "faker";
import { Driver } from "neo4j-driver/types/v1";
import { Product } from "../../types";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductCount,
  getProducts
} from ".";

let driver: Driver;

jest.mock("../../neo4j", () => {
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

describe("getProductCount function", () => {
  let numberOfProducts: number;
  let session: any;
  let output: number;

  beforeEach(() => {
    numberOfProducts = faker.random.number();
    session = {
      close: jest.fn(),
      run: jest.fn()
    };
    (driver.session as any).mockReturnValueOnce(session);
    (session.run as any).mockReturnValueOnce({
      records: [
        {
          get: () => ({
            toNumberOrInfinity: () => numberOfProducts
          })
        }
      ]
    });
  });

  describe("with search query", () => {
    beforeEach(async () => {
      output = await getProductCount({
        filter: {
          name: faker.commerce.productName()
        },
        search: faker.commerce.product()
      });
    });

    it("returns the number of products", () => {
      expect(output).toBe(numberOfProducts);
    });

    it("closes the session", () => {
      expect(session.close).toHaveBeenCalledTimes(1);
    });
  });

  describe("without search query", () => {
    beforeEach(async () => {
      output = await getProductCount({
        filter: {
          name: faker.commerce.productName()
        }
      });
    });

    it("returns the number of products", () => {
      expect(output).toBe(numberOfProducts);
    });

    it("closes the session", () => {
      expect(session.close).toHaveBeenCalledTimes(1);
    });
  });
});

describe("getProducts function", () => {
  const result = {
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
  };

  describe("with search query", () => {
    let products: Product[];
    let session: any;

    beforeEach(async () => {
      session = {
        close: jest.fn(),
        run: jest.fn()
      };
      (driver.session as any).mockReturnValueOnce(session);
      (session.run as any).mockReturnValueOnce(result);
      products = await getProducts({
        filter: {
          name: faker.commerce.productName()
        },
        limit: faker.random.number(),
        search: faker.commerce.product(),
        skip: faker.random.number(),
        sortField: "name",
        sortOrder: "ASC"
      });
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

  describe("without search query", () => {
    let products: Product[];
    let session: any;

    beforeEach(async () => {
      session = {
        close: jest.fn(),
        run: jest.fn()
      };
      (driver.session as any).mockReturnValueOnce(session);
      (session.run as any).mockReturnValueOnce(result);
      products = await getProducts({
        filter: {
          name: faker.commerce.productName()
        },
        limit: faker.random.number(),
        skip: faker.random.number(),
        sortField: "name",
        sortOrder: "ASC"
      });
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
    const sortField: any = "<invalid_field>";
    await expect(
      getProducts({
        filter: {
          name: faker.commerce.productName()
        },
        search: faker.commerce.product(),
        skip: faker.random.number(),
        limit: faker.random.number(),
        sortField,
        sortOrder: faker.random.arrayElement(["ASC", "DESC"])
      })
    ).rejects.toThrowError(new Error("Invalid product field: " + sortField));
  });

  it("throws error if sortOrder is invalid", async () => {
    const sortOrder: any = "<invalid_order>";
    await expect(
      getProducts({
        filter: {
          name: faker.commerce.productName()
        },
        limit: faker.random.number(),
        search: faker.commerce.product(),
        skip: faker.random.number(),
        sortField: "name",
        sortOrder
      })
    ).rejects.toThrowError(new Error("Invalid sort order: " + sortOrder));
  });
});
