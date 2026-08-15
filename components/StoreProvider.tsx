"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products as seededProducts, storeSettings as seededSettings } from "@/lib/catalog";
import type { CartItem, Order, Product, StoreSettings } from "@/lib/types";

type Customer = { name: string; email: string } | null;

type StoreContextValue = {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  settings: StoreSettings;
  customer: Customer;
  toast: string | null;
  setToast: (message: string | null) => void;
  addToCart: (productId: string, size: string, color: string, quantity?: number) => boolean;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (details: Order["customer"], payment: Order["payment"], coupon?: string) => Order | null;
  signIn: (name: string, email: string) => void;
  signOut: () => void;
  saveProduct: (product: Product) => void;
  archiveProduct: (id: string) => void;
  saveSettings: (settings: StoreSettings) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const keys = {
  products: "sm-products-v2",
  cart: "sm-cart-v1",
  wishlist: "sm-wishlist-v1",
  orders: "sm-orders-v1",
  settings: "sm-settings-v1",
  customer: "sm-customer-v1",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seededProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(seededSettings);
  const [customer, setCustomer] = useState<Customer>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProducts(read(keys.products, seededProducts));
    setCart(read(keys.cart, []));
    setWishlist(read(keys.wishlist, []));
    setOrders(read(keys.orders, []));
    setSettings(read(keys.settings, seededSettings));
    setCustomer(read<Customer>(keys.customer, null));
    setReady(true);
  }, []);

  useEffect(() => { if (ready) localStorage.setItem(keys.products, JSON.stringify(products)); }, [products, ready]);
  useEffect(() => { if (ready) localStorage.setItem(keys.cart, JSON.stringify(cart)); }, [cart, ready]);
  useEffect(() => { if (ready) localStorage.setItem(keys.wishlist, JSON.stringify(wishlist)); }, [wishlist, ready]);
  useEffect(() => { if (ready) localStorage.setItem(keys.orders, JSON.stringify(orders)); }, [orders, ready]);
  useEffect(() => { if (ready) localStorage.setItem(keys.settings, JSON.stringify(settings)); }, [settings, ready]);
  useEffect(() => { if (ready) localStorage.setItem(keys.customer, JSON.stringify(customer)); }, [customer, ready]);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const addToCart = useCallback((productId: string, size: string, color: string, quantity = 1) => {
    const product = products.find((item) => item.id === productId);
    if (!product || product.stock < quantity) {
      setToast("That size is currently unavailable.");
      return false;
    }
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId && item.size === size && item.color === color);
      if (existing) return current.map((item) => item.lineId === existing.lineId ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item);
      return [...current, { lineId: `${productId}-${size}-${color}`, productId, size, color, quantity }];
    });
    setToast(`${product.name} added to your bag.`);
    return true;
  }, [products]);

  const placeOrder = useCallback((details: Order["customer"], payment: Order["payment"], coupon?: string) => {
    if (!cart.length) return null;
    const lineProducts = cart.map((line) => ({ line, product: products.find((item) => item.id === line.productId) })).filter((item): item is { line: CartItem; product: Product } => Boolean(item.product));
    if (lineProducts.some(({ line, product }) => product.stock < line.quantity)) {
      setToast("One or more items are no longer in stock.");
      return null;
    }
    const subtotal = lineProducts.reduce((sum, { line, product }) => sum + product.price * line.quantity, 0);
    const discount = coupon?.toUpperCase() === "STYLE10" ? Math.min(Math.round(subtotal * 0.1), 400) : 0;
    const shipping = subtotal - discount >= settings.shippingThreshold ? 0 : 99;
    const order: Order = {
      id: `SM-${Math.floor(100000 + Math.random() * 899999)}`,
      createdAt: new Date().toISOString(), items: cart, subtotal, discount, shipping, total: subtotal - discount + shipping,
      status: "Confirmed", payment, customer: details,
    };
    setProducts((current) => current.map((product) => {
      const line = cart.find((item) => item.productId === product.id);
      return line ? { ...product, stock: Math.max(0, product.stock - line.quantity) } : product;
    }));
    setOrders((current) => [order, ...current]);
    setCart([]);
    setCustomer({ name: details.name, email: details.email });
    setToast("Order confirmed. We’ll keep you posted.");
    return order;
  }, [cart, products, settings.shippingThreshold]);

  const value = useMemo<StoreContextValue>(() => ({
    products, cart, wishlist, orders, settings, customer, toast, setToast,
    addToCart,
    removeFromCart: (lineId) => setCart((current) => current.filter((item) => item.lineId !== lineId)),
    updateQuantity: (lineId, quantity) => setCart((current) => current.map((item) => item.lineId === lineId ? { ...item, quantity: Math.max(1, quantity) } : item)),
    toggleWishlist: (productId) => setWishlist((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]),
    placeOrder,
    signIn: (name, email) => { setCustomer({ name, email }); setToast(`Welcome, ${name}.`); },
    signOut: () => { setCustomer(null); setToast("You’ve been signed out."); },
    saveProduct: (product) => setProducts((current) => current.some((item) => item.id === product.id) ? current.map((item) => item.id === product.id ? product : item) : [product, ...current]),
    archiveProduct: (id) => { setProducts((current) => current.filter((item) => item.id !== id)); setToast("Product archived."); },
    saveSettings: (nextSettings) => { setSettings(nextSettings); setToast("Store settings saved."); },
    updateOrderStatus: (id, status) => { setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order)); setToast("Order status updated."); },
  }), [products, cart, wishlist, orders, settings, customer, toast, addToCart, placeOrder]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}
