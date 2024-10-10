import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import { db } from "../mocks/db";
import { QueryClient, QueryClientProvider } from "react-query";
import { AllProviders } from "../AllProvider";

describe("ProductList", () => {
  const productIds: number[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });
  // clean up the global db state
  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it("should render the list of products", async () => {
    render(<ProductList />, { wrapper: AllProviders });
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });
  it("should render no products available if not product is found", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />, { wrapper: AllProviders });
    const message = await screen.findByText(/no product/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error message when there is an error", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    render(<ProductList />, { wrapper: AllProviders });
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render a loading indicator when fetching data", async () => {
    server.use(
      http.get("/products", async () => {
        await delay(200);
        return HttpResponse.json([]);
      })
    );

    render(<ProductList />, { wrapper: AllProviders });
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove the loading indicator after fetching data is fetched", async () => {
    render(<ProductList />, { wrapper: AllProviders });
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove the loading indicator after fetching data failed", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    render(<ProductList />, { wrapper: AllProviders });
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
