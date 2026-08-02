"use client";

import { BellRing, BellOff, LoaderCircle, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

type NotificationState =
  | "checking"
  | "available"
  | "enabled"
  | "blocked"
  | "unsupported"
  | "working";

function applicationServerKey(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const bytes = atob(base64);
  return Uint8Array.from(bytes, (character) => character.charCodeAt(0));
}

function supported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

async function registration() {
  await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  return navigator.serviceWorker.ready;
}

export default function NotificationSetup() {
  const [state, setState] = useState<NotificationState>("checking");
  const [message, setMessage] = useState("");
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    let active = true;

    const check = async () => {
      if (!supported()) {
        if (active) setState("unsupported");
        return;
      }

      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        ("standalone" in navigator &&
          Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

      if (isIOS && !isStandalone) {
        if (active) {
          setShowInstallHelp(true);
          setState("available");
        }
        return;
      }

      if (Notification.permission === "denied") {
        if (active) setState("blocked");
        return;
      }

      try {
        const current = await (await registration()).pushManager.getSubscription();
        if (active) setState(current ? "enabled" : "available");
      } catch {
        if (active) setState("available");
      }
    };

    void check();
    return () => {
      active = false;
    };
  }, []);

  const enable = async () => {
    setMessage("");

    if (!supported()) {
      setState("unsupported");
      return;
    }

    if (showInstallHelp) {
      setMessage("On iPhone: tap Share, choose Add to Home Screen, open DK Orders from the new icon, then enable alerts.");
      return;
    }

    setState("working");

    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setState(permission === "denied" ? "blocked" : "available");
        return;
      }

      const settingsResponse = await fetch("/api/admin/push-subscriptions", {
        cache: "no-store",
      });

      if (settingsResponse.status === 401) {
        window.location.replace("/admin/login");
        return;
      }

      const settings = (await settingsResponse.json()) as {
        configured?: boolean;
        publicKey?: string;
        error?: string;
      };

      if (!settingsResponse.ok || !settings.configured || !settings.publicKey) {
        throw new Error(settings.error || "Notifications are not configured yet.");
      }

      const ready = await registration();
      const existing = await ready.pushManager.getSubscription();
      const subscription =
        existing ??
        (await ready.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey(settings.publicKey),
        }));
      const saveResponse = await fetch("/api/admin/push-subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (!saveResponse.ok) {
        const result = (await saveResponse.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(result?.error || "Unable to save this device.");
      }

      setState("enabled");
      setMessage("This device will now receive new booking alerts.");
    } catch (error) {
      setState("available");
      setMessage(error instanceof Error ? error.message : "Unable to enable notifications.");
    }
  };

  const disable = async () => {
    setState("working");
    setMessage("");

    try {
      const current = await (await registration()).pushManager.getSubscription();

      if (current) {
        await fetch("/api/admin/push-subscriptions", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: current.endpoint }),
        });
        await current.unsubscribe();
      }

      setState("available");
      setMessage("Booking alerts are disabled on this device.");
    } catch {
      setState("enabled");
      setMessage("Unable to disable notifications. Please try again.");
    }
  };

  const enabled = state === "enabled";
  const working = state === "working" || state === "checking";

  return (
    <section className="mt-5 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-red-500/10 via-white/[0.035] to-transparent p-4 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-5">
      <div className="flex items-start gap-3.5">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300">
          {enabled ? <BellRing size={20} /> : <Smartphone size={20} />}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-white">Instant booking alerts</h2>
            {enabled && (
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Active
              </span>
            )}
          </div>
          <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-400 sm:text-sm">
            {state === "unsupported"
              ? "This browser does not support push notifications."
              : state === "blocked"
                ? "Notifications are blocked. Allow them in your browser or phone settings."
                : showInstallHelp
                  ? "Install DK Orders on your iPhone Home Screen to receive alerts like an app."
                  : "Receive an alert on this device whenever a customer books."}
          </p>
          {message && <p className="mt-2 text-xs leading-5 text-amber-200">{message}</p>}
        </div>
      </div>

      {state !== "unsupported" && state !== "blocked" && (
        <button
          type="button"
          onClick={enabled ? disable : enable}
          disabled={working}
          className={`mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition sm:mt-0 sm:w-auto sm:shrink-0 ${
            enabled
              ? "border border-white/10 bg-white/[0.04] text-zinc-300 hover:border-rose-400/30 hover:text-white"
              : "bg-red-600 text-white hover:bg-red-500"
          } disabled:cursor-wait disabled:opacity-60`}
        >
          {working ? (
            <LoaderCircle className="animate-spin" size={17} />
          ) : enabled ? (
            <BellOff size={17} />
          ) : (
            <BellRing size={17} />
          )}
          {working ? "Checking..." : enabled ? "Disable alerts" : showInstallHelp ? "How to install" : "Enable alerts"}
        </button>
      )}
    </section>
  );
}
