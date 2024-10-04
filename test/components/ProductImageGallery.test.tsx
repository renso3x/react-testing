import { render, screen } from "@testing-library/react";
import { it } from "vitest";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
  it("should not render if there are no images", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render a gallery of images when imageUrls are supplied", () => {
    const images = ["http://1.jpg", "2.jpg", "3.jpg"];
    render(<ProductImageGallery imageUrls={images} />);
    const img = screen.getAllByRole("img");
    expect(img).toHaveLength(3);

    images.forEach((url, index) => {
      expect(img[index]).toHaveAttribute("src", url);
    });
  });
});
