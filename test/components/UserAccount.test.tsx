import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  const user1: User = {
    id: 1,
    name: "Jon",
    isAdmin: true,
  };

  it("should render user name", () => {
    render(<UserAccount user={user1} />);
    expect(screen.getByText("Jon")).toBeInTheDocument();
  });

  it("should render edit button when user is admin", () => {
    render(<UserAccount user={user1} />);
    screen.debug();
    const editBtn = screen.queryByRole("button");
    expect(editBtn).toBeInTheDocument();
    expect(editBtn).toHaveTextContent(/edit/i);
  });

  it("should not render edit button when user is not an admin", () => {
    const notAdminUser = user1;
    notAdminUser.isAdmin = false;
    render(<UserAccount user={notAdminUser} />);
    screen.debug();
    const editBtn = screen.queryByRole("button");
    expect(editBtn).not.toBeInTheDocument();
  });
});
