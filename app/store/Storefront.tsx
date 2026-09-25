"use client";

import Image from "next/image";
import {
  Check,
  ChevronRight,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  formatStorePrice,
  storeProducts,
  type StoreProduct,
} from "./products";

type Cart = Record<string, number>;

const categories = ["All", "Convenience", "Safety", "Interior", "Exterior"] as const;
const CART_KEY = "driveway-kustoms-accessory-cart";

export default function Storefront() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Cart>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [cartReady, setCartReady] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ name: "", phone: "", vehicle: "" });

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_KEY);
      if (savedCart) setCart(JSON.parse(savedCart) as Cart);
    } catch {
      // A blocked or malformed local store should never stop shopping.
    } finally {
      setCartReady(true);
    }
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, cartReady]);

  useEffect(() => {
    if (!cartOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cartOpen]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return storeProducts.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch =
        !query ||
        `${product.name} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const cartItems = storeProducts
    .filter((product) => cart[product.id])
    .map((product) => ({ product, quantity: cart[product.id] }));
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  function changeQuantity(id: string, amount: number) {
    setCart((current) => {
      const nextQuantity = (current[id] ?? 0) + amount;
      if (nextQuantity <= 0) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      return { ...current, [id]: nextQuantity };
    });
  }

  function addToCart(product: StoreProduct) {
    changeQuantity(product.id, 1);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1300);
  }

  function orderOnWhatsApp() {
    if (!cartItems.length) return;

    const lines = cartItems.map(
      ({ product, quantity }) =>
        `• ${product.name} × ${quantity} — ${formatStorePrice(product.price * quantity)}`
    );
    const message = [
      "Hi Driveway Kustoms! I would like to order these accessories:",
      "",
      ...lines,
      "",
      `Estimated total: ${formatStorePrice(subtotal)}`,
      customer.name ? `Name: ${customer.name}` : "",
      customer.phone ? `Phone: ${customer.phone}` : "",
      customer.vehicle ? `Vehicle: ${customer.vehicle}` : "",
      "",
      "Please confirm compatibility, availability, and the final price.",
    ]
      .filter((line) => line !== "")
      .join("\n");

    window.open(
      `https://wa.me/918796562667?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const cartPanel = (
    <div className="flex h-full flex-col bg-[#0c0c0c]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-400">
            Your selection
          </p>
          <h2 className="mt-1 text-xl font-semibold">Accessory cart</h2>
        </div>
        <button
          type="button"
          onClick={() => setCartOpen(false)}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-red-500/50 hover:text-white lg:hidden"
          aria-label="Close cart"
        >
          <X size={18} />
        </button>
      </div>

      {cartItems.length ? (
        <>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {cartItems.map(({ product, quantity }) => (
              <article
                key={product.id}
                className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold leading-5 text-white">
                        {product.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        {formatStorePrice(product.price)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCart((current) => {
                          const next = { ...current };
                          delete next[product.id];
                          return next;
                        })
                      }
                      className="p-1 text-zinc-500 transition hover:text-red-400"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-white/10 bg-black/30">
                      <button
                        type="button"
                        onClick={() => changeQuantity(product.id, -1)}
                        className="grid h-7 w-7 place-items-center text-zinc-400 hover:text-white"
                        aria-label={`Decrease ${product.name} quantity`}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="min-w-6 text-center text-xs font-semibold">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(product.id, 1)}
                        className="grid h-7 w-7 place-items-center text-zinc-400 hover:text-white"
                        aria-label={`Increase ${product.name} quantity`}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatStorePrice(product.price * quantity)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="space-y-2">
              <input
                value={customer.name}
                onChange={(event) =>
                  setCustomer((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Your name"
                aria-label="Your name"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-red-500/70"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={customer.phone}
                  onChange={(event) =>
                    setCustomer((current) => ({ ...current, phone: event.target.value }))
                  }
                  placeholder="Phone"
                  aria-label="Phone number"
                  inputMode="tel"
                  className="h-11 min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-red-500/70"
                />
                <input
                  value={customer.vehicle}
                  onChange={(event) =>
                    setCustomer((current) => ({ ...current, vehicle: event.target.value }))
                  }
                  placeholder="Car model"
                  aria-label="Car model"
                  className="h-11 min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-red-500/70"
                />
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-zinc-500">Estimated total</p>
                <p className="mt-0.5 text-2xl font-semibold tracking-tight">
                  {formatStorePrice(subtotal)}
                </p>
              </div>
              <p className="text-[10px] text-zinc-600">Final price on confirmation</p>
            </div>

            <button
              type="button"
              onClick={orderOnWhatsApp}
              className="mt-4 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-[#39e578]"
            >
              Order on WhatsApp <ChevronRight size={17} />
            </button>
          </div>
        </>
      ) : (
        <div className="grid flex-1 place-items-center px-8 text-center">
          <div>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-500">
              <ShoppingBag size={25} />
            </span>
            <h3 className="mt-5 font-semibold">Your cart is empty</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Add the accessories you want and we&apos;ll confirm the best fit for your car.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10 px-4 pb-12 pt-12 sm:px-6 sm:pb-18 sm:pt-18">
        <div className="absolute left-1/2 top-0 -z-10 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-red-600/15 blur-[110px]" />
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
                <PackageCheck size={13} /> Accessories store
              </div>
              <h1 className="mt-5 max-w-3xl text-[2.65rem] font-semibold leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Small upgrades.
                <span className="block text-zinc-500">A better everyday drive.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-lg sm:leading-8">
                Shop useful, carefully selected accessories for comfort, safety, and style. We&apos;ll confirm compatibility before your order is final.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <ShieldCheck size={16} className="text-red-400" />
                <p className="mt-2 text-xs font-semibold">Fitment checked</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <PackageCheck size={16} className="text-red-400" />
                <p className="mt-2 text-xs font-semibold">Local support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-sm transition ${
                    category === item
                      ? "border-red-500 bg-red-600 text-white"
                      : "border-white/10 bg-white/[0.025] text-zinc-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <label className="relative block sm:w-72">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search accessories"
                className="h-11 w-full rounded-full border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-red-500/60"
              />
            </label>
          </div>

          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                  <span className="font-semibold text-white">{filteredProducts.length}</span>{" "}
                  accessories
                </p>
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold lg:hidden"
                >
                  <ShoppingBag size={15} /> Cart ({cartCount})
                </button>
              </div>

              {filteredProducts.length ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <article
                      key={product.id}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-red-500/60 hover:bg-white/[0.05] sm:rounded-[1.75rem]"
                    >
                      <div className="relative aspect-[1.1/1] overflow-hidden bg-zinc-900 sm:aspect-[1.2/1]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                        {product.badge && (
                          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white sm:left-4 sm:top-4 sm:text-[10px]">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-red-400 sm:text-[10px]">
                          {product.category}
                        </p>
                        <h2 className="mt-1.5 text-sm font-semibold leading-5 sm:text-lg sm:leading-6">
                          {product.name}
                        </h2>
                        <p className="mt-2 line-clamp-3 text-[11px] leading-[1.05rem] text-zinc-500 sm:text-sm sm:leading-6">
                          {product.description}
                        </p>
                        <p className="mt-3 flex items-center gap-1.5 text-[10px] text-zinc-500 sm:text-xs">
                          <Check size={12} className="shrink-0 text-green-400" />
                          {product.compatibility}
                        </p>

                        <div className="mt-auto pt-4">
                          <p className="text-lg font-semibold tracking-tight sm:text-xl">
                            From {formatStorePrice(product.price)}
                          </p>
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className={`mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-xs font-bold transition sm:text-sm ${
                              addedId === product.id
                                ? "bg-green-500 text-black"
                                : "bg-white text-black hover:bg-red-500 hover:text-white"
                            }`}
                          >
                            {addedId === product.id ? (
                              <><Check size={15} /> Added</>
                            ) : (
                              <><Plus size={15} /> Add to cart</>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-white/15 px-6 py-20 text-center">
                  <Search className="mx-auto text-zinc-600" />
                  <h2 className="mt-4 font-semibold">No accessories found</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategory("All");
                    }}
                    className="mt-3 text-sm text-red-400 hover:text-red-300"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <aside className="sticky top-28 hidden h-[calc(100vh-8rem)] min-h-[34rem] max-h-[48rem] overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl lg:block">
              {cartPanel}
            </aside>
          </div>
        </div>
      </section>

      {cartCount > 0 && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 left-1/2 z-40 flex min-h-13 -translate-x-1/2 items-center gap-3 rounded-full bg-red-600 px-5 text-sm font-bold text-white shadow-[0_18px_50px_rgba(220,38,38,0.45)] lg:hidden"
        >
          <ShoppingBag size={17} />
          View cart ({cartCount})
          <span className="border-l border-white/25 pl-3">{formatStorePrice(subtotal)}</span>
        </button>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
          />
          <div className="absolute inset-x-0 bottom-0 h-[88vh] overflow-hidden rounded-t-[2rem] border-t border-white/10 shadow-2xl">
            {cartPanel}
          </div>
        </div>
      )}
    </>
  );
}
