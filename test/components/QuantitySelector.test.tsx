import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import QuantitySelector from "../../src/components/QuantitySelector";
import { CartProvider } from "../../src/providers/CartProvider";
import { Product } from "../../src/entities";

describe("QuantitySelector", () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: "Milk",
      price: 5,
      categoryId: 1,
    };
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    return {
      getAddToCarButton: () =>
        screen.getByRole("button", { name: /add to cart/i }),
      addToCartButton: screen.getByRole("button", { name: /add to cart/i }),
      getQuantityControls: () => ({
        quantity: screen.queryByRole("status"),
        decrementBtn: screen.queryByRole("button", { name: "-" }),
        incrementBtn: screen.queryByRole("button", { name: "+" }),
      }),
      user: userEvent.setup(),
    };
  };

  it("should render the Add to Cart button", () => {
    const { addToCartButton } = renderComponent();

    expect(addToCartButton).toBeInTheDocument();
  });

  it("should add the product to the cart", async () => {
    const { addToCartButton, user, getQuantityControls } = renderComponent();

    await user.click(addToCartButton);
    const { quantity, decrementBtn, incrementBtn } = getQuantityControls();

    expect(quantity).toHaveTextContent("1");
    expect(decrementBtn).toBeInTheDocument();
    expect(incrementBtn).toBeInTheDocument();

    expect(addToCartButton).not.toBeInTheDocument();
  });

  it("should increment the quantity", async () => {
    const { addToCartButton, user, getQuantityControls } = renderComponent();
    await user.click(addToCartButton);
    const { quantity, incrementBtn } = getQuantityControls();

    await user.click(incrementBtn);

    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity", async () => {
    const { addToCartButton, user, getQuantityControls } = renderComponent();
    await user.click(addToCartButton);
    const { quantity, decrementBtn, incrementBtn } = getQuantityControls();

    await user.click(incrementBtn!);
    await user.click(decrementBtn!);

    expect(quantity).toHaveTextContent("1");
  });

  it("should remove the product from the cart ", async () => {
    const { getAddToCarButton, addToCartButton, user, getQuantityControls } =
      renderComponent();
    await user.click(addToCartButton);
    const { quantity, decrementBtn, incrementBtn } = getQuantityControls();

    await user.click(decrementBtn!);

    expect(quantity).not.toBeInTheDocument();
    expect(decrementBtn).not.toBeInTheDocument();
    expect(incrementBtn).not.toBeInTheDocument();

    expect(getAddToCarButton()).toBeInTheDocument();
  });
});
