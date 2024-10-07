import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe } from "vitest";
import TermsAndConditions from "../../src/components/TermsAndConditions";

describe("TermsAndConditions", () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);
    return {
      heading: screen.getByRole("heading"),
      checkbox: screen.getByRole("checkbox"),
      button: screen.getByRole("button"),
    };
  };
  it("should render with correct text and initial state ", () => {
    const { heading, checkbox, button } = renderComponent();

    expect(heading).toHaveTextContent("Terms & Conditions");
    expect(checkbox).not.toBeChecked();
    expect(button).toHaveTextContent(/submit/i);
    expect(button).toBeDisabled();
  });

  it("should enable the button when the checkbox is checked", async () => {
    // Arrange
    const { checkbox, button } = renderComponent();

    // Act
    const user = userEvent.setup();
    await user.click(checkbox);

    // Assert
    expect(button).toBeEnabled();
  });
});
