"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ORDER_STATUSES, type Order } from "@/lib/types";

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: Order["status"] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [value, setValue] = useState(status);

  async function updateStatus(next: Order["status"]) {
    setValue(next);
    setSaving(true);
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? "Could not update status.");
      setValue(status);
      return;
    }
    router.refresh();
  }

  return (
    <select
      className="input mt-4"
      value={value}
      disabled={saving}
      onChange={(e) => updateStatus(e.target.value as Order["status"])}
    >
      {ORDER_STATUSES.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}
