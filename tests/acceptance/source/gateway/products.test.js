const faker = require("faker");
const { UUID_REGEX } = require("../utilities/patterns");
const { createProduct } = require("./products");

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
});
