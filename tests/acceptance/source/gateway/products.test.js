const faker = require("faker");
const { UUID_REGEX } = require("../utilities/patterns");
const {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts
} = require("./products");

describe("creating a new product", () => {
  let name;
  let createProductResponse;

  beforeEach(async () => {
    name = faker.commerce.product();
    createProductResponse = await createProduct({
      name
    });
  });

  it("returns the new product", () => {
    expect(createProductResponse).toEqual({
      createProduct: {
        id: expect.stringMatching(UUID_REGEX),
        name
      }
    });
  });

  describe("when product is queried", () => {
    let getProductResponse;

    beforeEach(async () => {
      getProductResponse = await getProduct({
        id: createProductResponse.createProduct.id
      });
    });

    it("returns the new product", () => {
      expect(getProductResponse).toEqual({
        getProduct: {
          id: expect.stringMatching(UUID_REGEX),
          name
        }
      });
    });
  });

  describe("when products are queried", () => {
    let getProductsResponse;

    beforeEach(async () => {
      getProductsResponse = await getProducts();
    });

    it("returns the new product", () => {
      expect(getProductsResponse).toEqual({
        getProducts: expect.arrayContaining([
          {
            id: expect.stringMatching(UUID_REGEX),
            name
          }
        ])
      });
    });
  });

  describe("when product is deleted", () => {
    let deleteProductResponse;

    beforeEach(async () => {
      deleteProductResponse = await deleteProduct({
        id: createProductResponse.createProduct.id
      });
    });

    it("returns the deleted product", () => {
      expect(deleteProductResponse).toEqual({
        deleteProduct: {
          id: expect.stringMatching(UUID_REGEX),
          name
        }
      });
    });

    it("throws error when product is queried", async () => {
      return expect(
        getProduct({
          id: deleteProductResponse.deleteProduct.id
        })
      ).rejects.toThrow("Product does not exist.");
    });
  });
});
