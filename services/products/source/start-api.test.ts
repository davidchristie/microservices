const server = {
  listen: jest.fn(() => Promise.resolve({ url: "http://localhost:4000" }))
};

jest.mock("./api", () => ({
  createServer: jest.fn(() => server)
}));

describe("when module loads", () => {
  beforeEach(() => {
    require("./start-api");
  });

  it("starts the API server", () => {
    expect(server.listen).toBeCalledTimes(1);
  });
});
