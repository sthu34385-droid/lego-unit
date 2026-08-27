export const STORE_NAME = "Lego-Unit";
export const STORE_TAGLINE = "Premium building sets, made for Myanmar.";
export const CURRENCY = "MMK";
export const DELIVERY_FEE = 5000;
export const FREE_DELIVERY_THRESHOLD = 150000;
export const LOW_STOCK_THRESHOLD = 5;
export const ADMIN_COOKIE = "lu_admin";

export function getDeliveryFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}
