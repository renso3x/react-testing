import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { products } from "../mocks/data";

describe("ProductDetail", () => {
  it("should render product details page", async () => {
    render(<ProductDetail productId={1} />);
    expect(
      await screen.findByText(new RegExp(products[0].name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(products[0].price.toString()))
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
