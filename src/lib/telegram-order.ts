import { TELEGRAM_USERNAME } from "./constants";
import { formatMMK } from "./format";

export type TelegramOrderLine = {
  name: string;
  quantity: number;
  unitPrice: number;
};

export function buildTelegramOrderMessage(lines: TelegramOrderLine[]): string {
  const itemBlocks = lines.map((line) => {
    const lineTotal = line.unitPrice * line.quantity;
    return `• ${line.name} × ${line.quantity}\nPrice: ${formatMMK(lineTotal)}`;
  });

  const total = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  return ["LEGO ORDER", "", itemBlocks.join("\n\n"), "", `Total: ${formatMMK(total)}`, "", "Please confirm my order."].join("\n");
}

export function getTelegramWebUrl(message: string): string {
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
}

export function getTelegramAppUrl(message: string): string {
  return `tg://resolve?domain=${TELEGRAM_USERNAME}&text=${encodeURIComponent(message)}`;
}

export function isMobileUserAgent(ua: string): boolean {
  return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(ua);
}
