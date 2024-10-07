import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import ExpandableText from "../../src/components/ExpandableText";
import { expect } from "vitest";

describe("ExpandableText", () => {
  const limit = 255;
  const longText = "a".repeat(limit + 1);
  const truncatedText = longText.substring(0, limit) + "...";

  it("should render the full text if the text is not in the limit ", () => {
    render(<ExpandableText text={truncatedText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
  });

  it("should truncate text if the text is over the limit", async () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();

    const button = screen.queryByRole("button");
    expect(button).toHaveTextContent(/more/i);
  });

  it("should expand text if show more is clicked", async () => {
    render(<ExpandableText text={longText} />);

    const button = screen.queryByRole("button");
    const user = userEvent.setup();
    await user.click(button);

    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  });
});
