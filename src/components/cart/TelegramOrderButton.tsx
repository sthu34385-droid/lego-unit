"use client";

import { useToast } from "@/components/ui/Toast";
import { TELEGRAM_USERNAME } from "@/lib/constants";
import {
  buildTelegramOrderMessage,
  getTelegramAppUrl,
  getTelegramWebUrl,
  isMobileUserAgent,
  type TelegramOrderLine,
} from "@/lib/telegram-order";
import { cn } from "@/lib/cn";

function TelegramMark({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M21.5 3.3 18.9 20c-.2 1-1.2 1.4-2 .9l-5.5-4.1-2.7 2.6c-.3.3-.7.4-1.1.3l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.3L5.7 12.6 1 11.1c-1-.3-1-1.2.2-1.7L20 2.6c.9-.3 1.7.2 1.5.7Z" />
    </svg>
  );
}

export function TelegramOrderButton({
  lines,
  className,
}: {
  lines: TelegramOrderLine[];
  className?: string;
}) {
  const { toast } = useToast();
  const message = lines.length > 0 ? buildTelegramOrderMessage(lines) : "";
  const href = message ? getTelegramWebUrl(message) : `https://t.me/${TELEGRAM_USERNAME}`;

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (lines.length === 0 || !message) {
      e.preventDefault();
      toast("Your cart is empty.");
      return;
    }

    if (!isMobileUserAgent(navigator.userAgent)) {
      return;
    }

    e.preventDefault();
    const started = Date.now();
    window.location.href = getTelegramAppUrl(message);
    window.setTimeout(() => {
      if (document.visibilityState === "visible" && Date.now() - started < 2500) {
        window.location.href = href;
      }
    }, 900);
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn("btn btn-yellow w-full", className)}
      aria-label={`Order via Telegram @${TELEGRAM_USERNAME}`}
    >
      <TelegramMark />
      Order via Telegram
    </a>
  );
}
