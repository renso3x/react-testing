import { it, expect, describe } from "vitest";
import { db } from "./mocks/db";

describe("group", () => {
  it("should", async () => {
    const product = db.product.create({ name: "apple" });
    console.log(db.product.delete({ where: { name: { equals: product.id } } }));
  });
});
