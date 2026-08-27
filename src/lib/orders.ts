import { getDeliveryFee } from "./constants";
import { effectivePrice } from "./format";
import { listProducts, recordSales } from "./products";
import { readJson, writeJson } from "./store";
import type { CheckoutPayload, Order, OrderItem } from "./types";

const FILE = "orders.json";

async function getAll(): Promise<Order[]> {
  return readJson<Order[]>(FILE, []);
}

function makeOrderId(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `LU-${y}${m}${d}-${rand}`;
}

export async function listOrders(): Promise<Order[]> {
  const orders = await getAll();
  return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(orderId: string): Promise<Order | undefined> {
  const orders = await getAll();
  return orders.find((o) => o.orderId === orderId);
}

export async function createOrder(payload: CheckoutPayload): Promise<Order> {
  const catalog = await listProducts();
  const items: OrderItem[] = [];
  let subtotal = 0;

  for (const line of payload.items) {
    const product = catalog.find((p) => p.id === line.productId);
    if (!product) {
      throw new Error(`Product not found: ${line.productId}`);
    }
    if (line.quantity < 1) {
      throw new Error("Quantity must be at least 1.");
    }
    if (product.stock < line.quantity) {
      throw new Error(`${product.name} does not have enough stock.`);
    }
    const price = effectivePrice(product);
    items.push({
      productId: product.id,
      name: product.name,
      price,
      quantity: line.quantity,
      image: product.images[0],
    });
    subtotal += price * line.quantity;
  }

  const deliveryFee = getDeliveryFee(subtotal);
  const order: Order = {
    orderId: makeOrderId(),
    customerName: payload.customerName.trim(),
    phone: payload.phone.trim(),
    address: payload.address.trim(),
    note: payload.note?.trim() ?? "",
    paymentMethod: payload.paymentMethod,
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  await recordSales(items.map((item) => ({ id: item.productId, quantity: item.quantity })));

  const orders = await getAll();
  orders.unshift(order);
  await writeJson(FILE, orders);
  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<Order | undefined> {
  const orders = await getAll();
  const index = orders.findIndex((o) => o.orderId === orderId);
  if (index === -1) return undefined;
  orders[index] = { ...orders[index], status };
  await writeJson(FILE, orders);
  return orders[index];
}
