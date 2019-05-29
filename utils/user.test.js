const { createUser, createAccount } = require("./user");

describe("Generate Formdata", () => {
  it("Creates user data", () => {
    const user = createUser("testKey");
    expect(user).toBeDefined();
  });

  it("Creates account data", () => {
    const account = createAccount("testKey");
    expect(account).toBeDefined();
  });
});
