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

    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });

    const getQuantityControls = () => ({
      quantity: screen.queryByRole("status"),
      decrementBtn: screen.queryByRole("button", { name: "-" }),
      incrementBtn: screen.queryByRole("button", { name: "+" }),
    });
    const user = userEvent.setup();

    const addToCart = async () => {
      await user.click(addToCartButton);
    };

    const incrementQuantity = async () => {
      const { incrementBtn } = getQuantityControls();
      await user.click(incrementBtn!);
    };

    const decrementQuantity = async () => {
      const { decrementBtn } = getQuantityControls();
      await user.click(decrementBtn!);
    };

    const getAddToCartButton = () =>
      screen.getByRole("button", {
        name: /add to cart/i,
      });

    return {
      getAddToCartButton,
      addToCartButton,
      addToCart,
      getQuantityControls,
      incrementQuantity,
      decrementQuantity,
    };
  };

  it("should render the Add to Cart button", () => {
    const { addToCartButton } = renderComponent();

    expect(addToCartButton).toBeInTheDocument();
  });

  it("should add the product to the cart", async () => {
    const { addToCartButton, addToCart, getQuantityControls } =
      renderComponent();

    await addToCart();

    const { quantity, decrementBtn, incrementBtn } = getQuantityControls();
    expect(quantity).toHaveTextContent("1");
    expect(decrementBtn).toBeInTheDocument();
    expect(incrementBtn).toBeInTheDocument();

    expect(addToCartButton).not.toBeInTheDocument();
  });

  it("should increment the quantity", async () => {
    const { incrementQuantity, addToCart, getQuantityControls } =
      renderComponent();
    await addToCart();

    await incrementQuantity();

    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity", async () => {
    const {
      addToCart,
      incrementQuantity,
      decrementQuantity,
      getQuantityControls,
    } = renderComponent();

    await addToCart();

    await incrementQuantity();
    await decrementQuantity();

    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent("1");
  });

  it("should remove the product from the cart ", async () => {
    const {
      getAddToCartButton,
      addToCart,
      decrementQuantity,
      getQuantityControls,
    } = renderComponent();
    await addToCart();

    await decrementQuantity();

    const { quantity, decrementBtn, incrementBtn } = getQuantityControls();
    expect(quantity).not.toBeInTheDocument();
    expect(decrementBtn).not.toBeInTheDocument();
    expect(incrementBtn).not.toBeInTheDocument();

    screen.debug();

    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
