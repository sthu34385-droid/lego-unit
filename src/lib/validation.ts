export type FieldErrors = Record<string, string>;

export type ProductInput = {
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  images: string[];
  category: string;
  ageRange: string | null;
  pieceCount: number | null;
  stock: number | null;
  sku: string | null;
  isNew: boolean;
  isBestSeller: boolean;
  isSale: boolean;
};

function isEmptyValue(value: unknown): boolean {
  return value === undefined || value === null || value === "";
}

export function optionalText(value: unknown): string | null {
  if (isEmptyValue(value)) return null;
  const text = String(value).trim();
  if (!text || text === "null" || text === "undefined") return null;
  return text;
}

export function optionalNumber(value: unknown): number | null {
  if (isEmptyValue(value)) return null;
  const n = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateProduct(
  input: Partial<ProductInput>,
  categoryIds: string[],
): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.name?.trim()) {
    errors.name = "Product name is required";
  }

  if (input.price == null || Number.isNaN(Number(input.price))) {
    errors.price = "Price is required";
  } else if (Number(input.price) < 0) {
    errors.price = "Price cannot be negative";
  }

  if (!input.category?.trim()) {
    errors.category = "Please select a category";
  } else if (!categoryIds.includes(input.category)) {
    errors.category = "Please select a category";
  }

  if (!input.images || input.images.length === 0 || !input.images[0]) {
    errors.images = "Main image is required";
  }

  if (input.salePrice != null) {
    if (Number.isNaN(Number(input.salePrice)) || Number(input.salePrice) < 0) {
      errors.salePrice = "Enter a valid discount price.";
    } else if (input.price != null && !Number.isNaN(Number(input.price)) && Number(input.salePrice) >= Number(input.price)) {
      errors.salePrice = "Discount price must be lower than the regular price.";
    }
  }

  if (input.stock != null && (Number.isNaN(Number(input.stock)) || Number(input.stock) < 0)) {
    errors.stock = "Enter a valid stock quantity.";
  }

  if (input.pieceCount != null && (Number.isNaN(Number(input.pieceCount)) || Number(input.pieceCount) < 1)) {
    errors.pieceCount = "Enter a valid piece count.";
  }

  return errors;
}

export function validateCategoryName(name: string): string | null {
  if (!name.trim()) return "Category name is required";
  if (name.trim().length < 2) return "Category name is too short";
  return null;
}
