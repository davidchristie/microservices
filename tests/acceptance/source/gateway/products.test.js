const faker = require("faker");
const { UUID_REGEX } = require("../utilities/patterns");
const { createProduct, getProduct } = require("./products");

describe("creating a new product", () => {
  let name;
  let response;

  beforeEach(async () => {
    name = faker.commerce.product();
    response = await createProduct({
      name
    });
  });

  it("returns the new product", () => {
    expect(response).toEqual({
      createProduct: {
        id: expect.stringMatching(UUID_REGEX),
        name
      }
    });
  });

  describe("when product is queried", () => {
    beforeEach(async () => {
      response = await getProduct({
        id
      });
    });

    it("returns the new product", () => {
      expect(response).toEqual({
        getProduct: {
          id: expect.stringMatching(UUID_REGEX),
          name
        }
      });
    });
  });

  describe("when products are queried", () => {
    beforeEach(async () => {
      response = await getProducts();
    });

    it("returns the new product", () => {
      expect(response).toEqual({
        getProducts: expect.arrayContaining({
          id: expect.stringMatching(UUID_REGEX),
          name
        })
      });
    });
  });

  describe("when product is deleted", () => {
    beforeEach(async () => {
      response = await deleteProduct({
        id
      });
    });

    it("returns the deleted product", () => {
      expect(response).toEqual({
        deleteProduct: {
          id: expect.stringMatching(UUID_REGEX),
          name
        }
      });
    });

    describe("when product is queried", () => {
      beforeEach(async () => {
        response = await getProduct({
          id
        });
      });

      it("returns null", () => {
        expect(response).toEqual({
          getProduct: null
        });
      });
    });
  });
});
