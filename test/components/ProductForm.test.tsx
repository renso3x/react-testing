import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { AllProviders } from "../AllProvider";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";

describe("ProductForm", () => {
  let category: Category;
  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = (product?: Product) => {
    render(<ProductForm product={product} onSubmit={vi.fn()} />, {
      wrapper: AllProviders,
    });

    return {
      waitForFormToLoad: () => screen.findByRole("form"),
      getInputs: () => {
        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox"),
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad, getInputs } = renderComponent();
    // Option: to test a loading state in your screen
    // 1.
    await waitForFormToLoad();
    // 2. await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    const { nameInput, priceInput, categoryInput } = getInputs();
    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it("should popoulate form fields when editing a product", async () => {
    const product: Product = {
      id: 1,
      name: "Bread",
      price: 10,
      categoryId: category.id,
    };
    const { waitForFormToLoad, getInputs } = renderComponent(product);

    await waitForFormToLoad();
    const { nameInput, priceInput, categoryInput } = getInputs();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });
});
