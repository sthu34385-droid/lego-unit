export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", hint: "Pay in cash when your order arrives." },
  { id: "bank", label: "Bank Transfer", hint: "We will share transfer details after your order is placed." },
  { id: "mobile", label: "Mobile Payment", hint: "Pay with KBZPay, WavePay, or AYA Pay after confirmation." },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  images: string[];
  category: string;
  ageRange: string | null;
  pieceCount: number | null;
  stock: number | null;
  sku?: string | null;
  isNew: boolean;
  isBestSeller: boolean;
  isSale: boolean;
  soldCount: number;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type Order = {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: PaymentMethodId;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};
