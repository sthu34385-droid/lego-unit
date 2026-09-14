import { readJson, writeJson } from "./store";
import type { Order } from "./types";

const FILE = "orders.json";

async function getAll(): Promise<Order[]> {
  return readJson<Order[]>(FILE, []);
}

export async function listOrders(): Promise<Order[]> {
  const orders = await getAll();
  return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(orderId: string): Promise<Order | undefined> {
  const orders = await getAll();
  return orders.find((o) => o.orderId === orderId);
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

export async function deleteOrder(orderId: string): Promise<boolean> {
  const orders = await getAll();
  const next = orders.filter((o) => o.orderId !== orderId);
  if (next.length === orders.length) return false;
  await writeJson(FILE, next);
  return true;
}
