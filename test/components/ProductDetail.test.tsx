import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import { products } from "../mocks/data";
import { db } from "../mocks/db";
import { AllProviders } from "../AllProvider";

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

    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });
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
    render(<ProductDetail productId={0} />, { wrapper: AllProviders });

    const message = await screen.findByText(/Invalid product/i);
    expect(message).toBeInTheDocument();
  });

  it("should render error if data fetching fails", async () => {
    server.use(
      http.get("/products/1", () => {
        HttpResponse.error();
      })
    );
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render a loading indicator when fetching data", async () => {
    server.use(
      http.get("/products/1", async () => {
        await delay(200);
        return HttpResponse.json([]);
      })
    );

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove the loading indicator when fetching data is fetched", async () => {
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove the loading indicator when there is an error", async () => {
    server.use(
      http.get("/products/1", () => {
        HttpResponse.error();
      })
    );
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
