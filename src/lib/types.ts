export const CATEGORY_IDS = [
  "city",
  "technic",
  "creator",
  "friends",
  "cars",
  "architecture",
  "space",
  "animals",
  "kids",
  "other",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

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

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  category: CategoryId;
  ageRange: string;
  pieceCount: number;
  stock: number;
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

export type CheckoutPayload = {
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: PaymentMethodId;
  items: CartItem[];
};
