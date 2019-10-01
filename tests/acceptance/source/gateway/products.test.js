const faker = require("faker");
const { UUID_REGEX } = require("../utilities/patterns");
const {
  allProductsQuery,
  createProductMutation,
  deleteProductMutation,
  productQuery
} = require("./products");

describe("creating a new product", () => {
  let name;
  let createProductResponse;

  beforeEach(async () => {
    name = faker.commerce.product();
    createProductResponse = await createProductMutation({
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
      getProductResponse = await productQuery({
        id: createProductResponse.createProduct.id
      });
    });

    it("returns the new product", () => {
      expect(getProductResponse).toEqual({
        Product: {
          id: expect.stringMatching(UUID_REGEX),
          name
        }
      });
    });
  });

  describe("when products are queried", () => {
    let allProductsResponse;

    beforeEach(async () => {
      allProductsResponse = await allProductsQuery();
    });

    it("contains the new product", () => {
      expect(allProductsResponse).toEqual({
        allProducts: expect.arrayContaining([
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
      deleteProductResponse = await deleteProductMutation({
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
        productQuery({
          id: deleteProductResponse.deleteProduct.id
        })
      ).rejects.toThrow("Product does not exist.");
    });
  });
});
