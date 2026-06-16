"use client";

import { useEffect, useRef } from "react";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, opts: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({ onVerify, onExpire }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const widgetIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  onVerifyRef.current = onVerify;
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onVerifyRef.current(token),
        "expired-callback": () => onExpireRef.current?.(),
        theme: "dark",
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [siteKey]);

  if (!siteKey) return null;

  return <div ref={containerRef} className="flex justify-center my-4" />;
}
