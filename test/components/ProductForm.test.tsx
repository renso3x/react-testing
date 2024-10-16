import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { AllProviders } from "../AllProvider";

describe("ProductForm", () => {
  it("should render form fields", async () => {
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders });

    // Option: to test a loading state in your screen
    // 1.
    await screen.findByRole("form");
    // 2. await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
  });
});
