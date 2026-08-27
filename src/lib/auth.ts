import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "./constants";
import { isValidAdminToken } from "./admin-token";

export { createAdminToken, isValidAdminToken } from "./admin-token";

export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return isValidAdminToken(store.get(ADMIN_COOKIE)?.value);
}
