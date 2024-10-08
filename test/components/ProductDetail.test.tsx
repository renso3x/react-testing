import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { products } from "../mocks/data";
import { db } from "../mocks/db";

describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });
  // clean up the global db state
  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render product details page", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />);
    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product.price!.toString()))
    ).toBeInTheDocument();
  });

  it("should render message if product not found", async () => {
    server.use(
      http.get("/products/1", () => {
        HttpResponse.json(null);
      })
    );
    render(<ProductDetail productId={0} />);

    const message = await screen.findByText(/Invalid product/i);
    expect(message).toBeInTheDocument();
  });
});
