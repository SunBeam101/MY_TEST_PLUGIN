import { jest } from "@jest/globals"
import { mockApp, mockPlugin, mockNote } from "./test-helpers.js"

// --------------------------------------------------------------------------------------
describe("This here plugin", () => {
  const plugin = mockPlugin();
  plugin._testEnvironment = true;
  const app = mockApp();

  it("should show today's date", async () => {
    const result = await plugin.insertText["Test Plugin"].run(app);
    expect(result).toBe("Hello world! Today is a Thursday")
  }, 10000)
});
