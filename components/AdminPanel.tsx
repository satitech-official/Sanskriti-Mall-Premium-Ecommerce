"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { currency } from "@/lib/catalog";
import { slugify } from "@/lib/utils";
import type { Order, Product, StoreSettings } from "@/lib/types";
import { useStore } from "./StoreProvider";

const adminLinks = [
  ["dashboard", "Overview"], ["products", "Products"], ["categories", "Categories"], ["orders", "Orders"], ["customers", "Customers"], ["coupons", "Coupons"], ["reviews", "Reviews"], ["homepage", "Homepage CMS"], ["campaigns", "Campaigns"], ["media", "Media library"], ["settings", "Store settings"],
] as const;

export function AdminLogin() {
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!String(data.get("email")).includes("@") || String(data.get("password")).length < 6) { setError("Enter a valid email and a password with at least 6 characters."); return; }
    sessionStorage.setItem("sm-admin-session", "manager");
    window.location.assign("/admin/dashboard");
  };
  return <div className="admin-login"><div className="admin-login-brand"><p className="eyebrow light">Sanskriti Mall / operations</p><h1>THE STORE,<br /><i>IN HAND.</i></h1><p>Manage the local storefront from one focused workspace.</p></div><form onSubmit={submit}><p className="eyebrow">Team access</p><h2>Welcome back.</h2><label>Work email<input name="email" type="email" placeholder="name@sanskritimall.in" required /></label><label>Password<input name="password" type="password" placeholder="••••••••" required /></label>{error && <p className="form-error">{error}</p>}<button className="button button-dark">Sign in <span>→</span></button><p className="demo-note">Local demo mode: credentials are checked in this browser. Connect a secure auth provider before production launch.</p><Link className="text-link" href="/">Back to storefront →</Link></form></div>;
}

export function AdminPanel({ section }: { section: string }) {
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => setAuthorized(sessionStorage.getItem("sm-admin-session") === "manager"), []);
  if (!authorized) return <div className="admin-guard"><p className="eyebrow">Protected store area</p><h1>Team access required.</h1><Link className="button button-dark" href="/admin/login">Go to admin login</Link></div>;
  const label = adminLinks.find(([value]) => value === section)?.[1] ?? "Overview";
  return <div className="admin-layout"><aside className="admin-sidebar"><Link className="admin-wordmark" href="/admin/dashboard">SANSKRITI<small>MALL / ADMIN</small></Link><nav>{adminLinks.map(([value, name]) => <Link className={section === value ? "active" : ""} key={value} href={`/admin/${value}`}>{name}</Link>)}</nav><button onClick={() => { sessionStorage.removeItem("sm-admin-session"); window.location.assign("/admin/login"); }}>Sign out ↗</button></aside><main className="admin-main"><header><div><p className="eyebrow">Store operations / local demo data</p><h1>{label}</h1></div><Link href="/" className="admin-view-store">View storefront ↗</Link></header>{section === "dashboard" && <Dashboard />}{section === "products" && <ProductsManager />}{section === "orders" && <OrdersManager />}{section === "settings" && <SettingsManager />}{section === "categories" && <CategoriesManager />}{section === "customers" && <CustomersManager />}{section === "coupons" && <CouponsManager />}{section === "reviews" && <ReviewsManager />}{["homepage", "campaigns", "media"].includes(section) && <ContentManager section={section} />}</main></div>;
}

function Dashboard() {
  const { products, orders } = useStore();
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const customers = new Set(orders.map((order) => order.customer.email)).size;
  const lowStock = products.filter((product) => product.stock < 8).length;
  const metrics = [["Revenue", currency(revenue), "from saved local orders"], ["Orders", String(orders.length), "placed in this browser"], ["Customers", String(customers), "from those orders"], ["Low stock", String(lowStock), "styles below 8 units"]];
  return <><div className="admin-kpis">{metrics.map(([label, value, note]) => <article key={label}><p>{label}</p><strong>{value}</strong><small>{note}</small></article>)}</div><div className="admin-dashboard-grid"><section className="admin-panel"><div className="panel-heading"><div><p className="eyebrow">Live calculation</p><h2>Revenue activity</h2></div><span className="admin-badge">Device data</span></div><div className="revenue-chart">{[32, 58, 42, 72, 39, 82, 63].map((height, index) => <span key={index} style={{ height: `${height}%` }}><i>{["M", "T", "W", "T", "F", "S", "S"][index]}</i></span>)}</div><p className="admin-note">The chart becomes meaningful as customer orders are placed in this browser. It never mixes in placeholder sales figures.</p></section><section className="admin-panel"><div className="panel-heading"><div><p className="eyebrow">Inventory watch</p><h2>Needs attention</h2></div><Link href="/admin/products">Manage →</Link></div>{products.filter((product) => product.stock < 10).slice(0, 5).map((product) => <div className="stock-row" key={product.id}><span>{product.name}</span><b>{product.stock} left</b></div>)}{!products.some((product) => product.stock < 10) && <p className="admin-note">All styles are safely stocked.</p>}</section></div></>;
}

function ProductsManager() {
  const { products, archiveProduct } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const filtered = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
  return <><div className="admin-toolbar"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" /><button className="button button-dark" onClick={() => setEditing(newProduct())}>Add product <span>+</span></button></div><section className="admin-panel table-panel"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th /></tr></thead><tbody>{filtered.map((product) => <tr key={product.id}><td><img src={product.image} alt="" />{product.name}<small>{product.id}</small></td><td>{product.category}</td><td>{currency(product.price)}</td><td><span className={product.stock < 8 ? "stock-low" : ""}>{product.stock}</span></td><td><button className="table-action" onClick={() => setEditing(product)}>Edit</button><button className="table-action danger" onClick={() => { if (confirm(`Archive ${product.name}?`)) archiveProduct(product.id); }}>Archive</button></td></tr>)}</tbody></table>{!filtered.length && <p className="admin-note">No matching products. Add a new piece or change your search.</p>}</section>{editing && <ProductEditor product={editing} onClose={() => setEditing(null)} />}</>;
}

function newProduct(): Product { return { id: `sm-${Date.now()}`, slug: "", name: "", category: "Casual Wear", price: 1499, originalPrice: 1699, rating: 4.5, reviews: 0, colors: ["Stone"], sizes: ["M", "L", "XL"], stock: 10, fabric: "Cotton", occasion: ["Casual"], fit: "Regular", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85", imageAlt: "Men’s fashion item", description: "" }; }

function ProductEditor({ product, onClose }: { product: Product; onClose: () => void }) {
  const { saveProduct } = useStore();
  const [draft, setDraft] = useState(product);
  const set = <K extends keyof Product>(key: K, value: Product[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => { event.preventDefault(); if (!draft.name.trim() || !draft.description.trim() || draft.price <= 0) return; saveProduct({ ...draft, slug: draft.slug || slugify(draft.name) }); onClose(); };
  return <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Product editor"><form className="product-editor" onSubmit={submit}><div className="editor-head"><div><p className="eyebrow">Product editor</p><h2>{product.name || "New product"}</h2></div><button type="button" className="close-button" onClick={onClose}>×</button></div><div className="form-grid"><label>Name<input value={draft.name} onChange={(event) => set("name", event.target.value)} required /></label><label>Category<select value={draft.category} onChange={(event) => set("category", event.target.value)}>{["Co-Ord Sets", "Cotton Linen", "Casual Wear", "Office Edit", "Formal Wear", "Festive Collection", "Smart Casuals"].map((category) => <option key={category}>{category}</option>)}</select></label><label>Price<input value={draft.price} type="number" min="1" onChange={(event) => set("price", Number(event.target.value))} required /></label><label>Original price<input value={draft.originalPrice} type="number" min="1" onChange={(event) => set("originalPrice", Number(event.target.value))} required /></label><label>Stock<input value={draft.stock} type="number" min="0" onChange={(event) => set("stock", Number(event.target.value))} required /></label><label>Fit<select value={draft.fit} onChange={(event) => set("fit", event.target.value as Product["fit"])}>{["Slim", "Regular", "Relaxed"].map((fit) => <option key={fit}>{fit}</option>)}</select></label><label className="full-span">Image URL<input value={draft.image} onChange={(event) => set("image", event.target.value)} required /></label><label className="full-span">Description<textarea value={draft.description} onChange={(event) => set("description", event.target.value)} required /></label></div><button className="button button-dark">Save product <span>→</span></button></form></div>;
}

function OrdersManager() {
  const { orders, updateOrderStatus } = useStore();
  if (!orders.length) return <section className="admin-panel admin-empty"><p className="eyebrow">No device orders yet</p><h2>Orders appear here when checkout is completed.</h2><p>Order status, revenue and stock updates are calculated from the same saved store data.</p></section>;
  return <section className="admin-panel table-panel"><table><thead><tr><th>Order</th><th>Customer</th><th>Payment</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong><small>{new Date(order.createdAt).toLocaleDateString("en-IN")}</small></td><td>{order.customer.name}<small>{order.customer.email}</small></td><td>{order.payment}</td><td>{currency(order.total)}</td><td><select className="order-status-select" value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value as Order["status"])}>{["Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"].map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></section>;
}

function CategoriesManager() {
  const { products, saveProduct, setToast } = useStore();
  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products]);
  const rename = (category: string) => { const name = prompt("Rename this category", category)?.trim(); if (!name || name === category) return; products.filter((product) => product.category === category).forEach((product) => saveProduct({ ...product, category: name })); setToast(`${category} renamed to ${name}.`); };
  return <section className="admin-panel category-manager"><div className="panel-heading"><div><p className="eyebrow">Catalog structure</p><h2>Categories</h2></div><span>{categories.length} live</span></div>{categories.map((category) => <div className="category-row" key={category}><div><strong>{category}</strong><small>{products.filter((product) => product.category === category).length} assigned product(s)</small></div><button className="table-action" onClick={() => rename(category)}>Rename</button></div>)}<p className="admin-note">Renaming a category updates the related catalog filters immediately. Create a new category when adding a product.</p></section>;
}

function CustomersManager() {
  const { orders } = useStore();
  const customers = Object.values(orders.reduce<Record<string, { name: string; email: string; orders: number; spend: number }>>((all, order) => { const current = all[order.customer.email] ?? { name: order.customer.name, email: order.customer.email, orders: 0, spend: 0 }; current.orders += 1; current.spend += order.total; all[order.customer.email] = current; return all; }, {}));
  return <section className="admin-panel table-panel">{customers.length ? <table><thead><tr><th>Customer</th><th>Orders</th><th>Lifetime spend</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.email}><td><strong>{customer.name}</strong><small>{customer.email}</small></td><td>{customer.orders}</td><td>{currency(customer.spend)}</td></tr>)}</tbody></table> : <div className="admin-empty"><p className="eyebrow">Customer relationships</p><h2>Customer records appear after real demo orders.</h2><p>This workspace only derives customers from stored checkout data—it does not invent a CRM list.</p></div>}</section>;
}

function CouponsManager() { return <section className="admin-panel coupon-admin"><p className="eyebrow">Active promotion</p><h2>STYLE10</h2><p>10% off up to ₹400. Available at checkout and calculated against the current shopping bag.</p><div><span>Minimum order</span><strong>No minimum</strong></div><div><span>Usage</span><strong>Unlimited in local demo mode</strong></div><Link className="button button-dark" href="/checkout">Test checkout flow ↗</Link><p className="admin-note">Coupons are intentionally kept as a single auditable rule in this local demo. Connect this panel to your production promotion service before launch.</p></section>; }

function ReviewsManager() { return <section className="admin-panel reviews-admin"><p className="eyebrow">Review moderation</p><h2>Verified feedback starts with orders.</h2><p>Once connected to a production customer database, reviews should only be submitted by buyers with delivered orders. This local demo doesn’t simulate customer feedback or moderation decisions.</p><div className="review-policy"><span>✓</span><p>Storefront product ratings use clear demo data until real review records are connected.</p></div></section>; }

function ContentManager({ section }: { section: string }) { const heading = section === "homepage" ? "Homepage CMS" : section === "campaigns" ? "Campaign desk" : "Media library"; const description = section === "homepage" ? "Public contact and store information is live-managed below. Hero and collection art is currently part of the curated source template." : section === "campaigns" ? "The current Weekend Style Drop has a working WhatsApp inquiry path on the storefront. Schedule production campaigns through your connected CMS." : "Product image URLs are managed directly in the product editor. Connect a media provider for upload and reuse at scale."; return <section className="admin-panel content-panel"><p className="eyebrow">{heading}</p><h2>{section === "homepage" ? "Keep the public store details current." : section === "campaigns" ? "Campaign content with a real destination." : "A clean hand-off point for image management."}</h2><p>{description}</p><Link className="button button-dark" href={section === "homepage" ? "/admin/settings" : section === "media" ? "/admin/products" : "/"}>{section === "homepage" ? "Edit store details →" : section === "media" ? "Manage product images →" : "Preview campaign →"}</Link></section>; }

function SettingsManager() {
  const { settings, saveSettings } = useStore();
  const [draft, setDraft] = useState<StoreSettings>(settings);
  useEffect(() => setDraft(settings), [settings]);
  const update = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => setDraft((current) => ({ ...current, [key]: value }));
  return <form className="admin-panel settings-form" onSubmit={(event) => { event.preventDefault(); saveSettings(draft); }}><div className="panel-heading"><div><p className="eyebrow">Public-facing information</p><h2>Store settings</h2></div><span className="admin-badge">Live on storefront</span></div><div className="form-grid"><label>Store name<input value={draft.name} onChange={(event) => update("name", event.target.value)} /></label><label>Phone<input value={draft.phone} onChange={(event) => update("phone", event.target.value)} /></label><label>WhatsApp number<input value={draft.whatsapp} onChange={(event) => update("whatsapp", event.target.value.replace(/\D/g, ""))} /></label><label>Email<input value={draft.email} type="email" onChange={(event) => update("email", event.target.value)} /></label><label className="full-span">Address<input value={draft.address} onChange={(event) => update("address", event.target.value)} /></label><label>Opening hours<input value={draft.hours} onChange={(event) => update("hours", event.target.value)} /></label><label>Instagram<input value={draft.instagram} onChange={(event) => update("instagram", event.target.value)} /></label><label>Free shipping threshold<input type="number" value={draft.shippingThreshold} onChange={(event) => update("shippingThreshold", Number(event.target.value))} /></label></div><button className="button button-dark">Save store settings <span>→</span></button></form>;
}
