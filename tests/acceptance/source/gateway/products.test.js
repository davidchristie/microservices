const faker = require("faker");
const { createProduct } = require("./products");
import { UUID_REGEX } from "../utilities/patterns";

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
