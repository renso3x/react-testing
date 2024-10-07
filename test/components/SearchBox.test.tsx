import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import SearchBox from "../../src/components/SearchBox";

describe("SearchBox", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    const user = userEvent.setup();

    return {
      input: screen.getByRole("textbox"),
      placeholder: screen.getByPlaceholderText(/Search/i),
      onChange,
      user,
    };
  };
  it("should render searchbox", () => {
    const { input } = renderComponent();
    expect(input).toBeInTheDocument();
  });

  it("should call onChange when searching an input", async () => {
    const { input, user, onChange } = renderComponent();
    const searchTerm = "Search";
    await user.type(input, searchTerm + "{enter}");
    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  it("should not trigger onChange when input is empty", async () => {
    const { input, user, onChange } = renderComponent();
    await user.type(input, "{enter}");
    expect(onChange).not.toHaveBeenCalledWith();
  });
});
