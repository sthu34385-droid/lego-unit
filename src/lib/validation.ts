import { CATEGORY_IDS, PAYMENT_METHODS, type CheckoutPayload, type PaymentMethodId } from "./types";

export type FieldErrors = Record<string, string>;

const PHONE_RE = /^(?:09|\+?959)\d{7,9}$/;

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, "");
}

export function validateCheckout(input: Partial<CheckoutPayload>): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.customerName?.trim() ?? "";
  const phone = normalizePhone(input.phone ?? "");
  const address = input.address?.trim() ?? "";
  const paymentMethod = input.paymentMethod;

  if (name.length < 2) errors.customerName = "Please enter your full name.";
  if (!PHONE_RE.test(phone)) {
    errors.phone = "Enter a valid Myanmar phone number, such as 09xxxxxxx.";
  }
  if (address.length < 10) {
    errors.address = "Please enter a complete delivery address.";
  }
  if (!PAYMENT_METHODS.some((m) => m.id === paymentMethod)) {
    errors.paymentMethod = "Please choose a payment method.";
  }
  if (!input.items || input.items.length === 0) {
    errors.items = "Your cart is empty.";
  }

  return errors;
}

export function isPaymentMethod(value: string): value is PaymentMethodId {
  return PAYMENT_METHODS.some((m) => m.id === value);
}

export function isCategoryId(value: string): value is (typeof CATEGORY_IDS)[number] {
  return CATEGORY_IDS.includes(value as (typeof CATEGORY_IDS)[number]);
}

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  category: string;
  ageRange: string;
  pieceCount: number;
  stock: number;
  isNew: boolean;
  isBestSeller: boolean;
  isSale: boolean;
};

export function validateProduct(input: Partial<ProductInput>): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.name?.trim() || input.name.trim().length < 2) {
    errors.name = "Product name is required.";
  }
  if (!input.description?.trim() || input.description.trim().length < 10) {
    errors.description = "Please write a short product description.";
  }
  if (input.price == null || Number.isNaN(input.price) || input.price < 0) {
    errors.price = "Enter a valid price in MMK.";
  }
  if (!input.category || !isCategoryId(input.category)) {
    errors.category = "Choose a category.";
  }
  if (!input.ageRange?.trim()) errors.ageRange = "Enter a recommended age range.";
  if (input.pieceCount == null || input.pieceCount < 1) {
    errors.pieceCount = "Enter the number of pieces.";
  }
  if (input.stock == null || input.stock < 0) {
    errors.stock = "Enter available stock.";
  }
  if (input.isSale) {
    if (input.salePrice == null || input.salePrice <= 0) {
      errors.salePrice = "Enter a sale price.";
    } else if (input.price != null && input.salePrice >= input.price) {
      errors.salePrice = "Sale price must be lower than the regular price.";
    }
  }
  return errors;
}
