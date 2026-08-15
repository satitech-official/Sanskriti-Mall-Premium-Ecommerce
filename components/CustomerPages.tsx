"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { currency } from "@/lib/catalog";
import { productById } from "@/lib/utils";
import { useStore } from "./StoreProvider";
import { ProductCard } from "./ProductCard";

function CartTotals({ coupon = "" }: { coupon?: string }) {
  const { cart, products, settings } = useStore();
  const subtotal = cart.reduce((sum, line) => sum + (productById(products, line.productId)?.price ?? 0) * line.quantity, 0);
  const discount = coupon.toUpperCase() === "STYLE10" ? Math.min(Math.round(subtotal * .1), 400) : 0;
  const shipping = subtotal - discount >= settings.shippingThreshold ? 0 : 99;
  return <div className="cart-totals"><p><span>Subtotal</span><strong>{currency(subtotal)}</strong></p>{discount > 0 && <p><span>Style10</span><strong>−{currency(discount)}</strong></p>}<p><span>Shipping</span><strong>{shipping ? currency(shipping) : "Free"}</strong></p><p className="total-line"><span>Total</span><strong>{currency(subtotal - discount + shipping)}</strong></p></div>;
}

export function CartPage() {
  const { cart, products, removeFromCart, updateQuantity } = useStore();
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  if (!cart.length) return <EmptyPage eyebrow="Your bag is empty" title="Good style is one click away." href="/shop" action="Explore the collection" />;
  return <div className="cart-page"><div className="page-heading"><p className="eyebrow">Your selection</p><h1>SHOPPING <i>BAG.</i></h1><p>{cart.length} considered piece{cart.length === 1 ? "" : "s"}, ready when you are.</p></div><div className="cart-layout"><div className="cart-lines">{cart.map((line) => { const product = productById(products, line.productId); if (!product) return null; return <article className="cart-line" key={line.lineId}><img src={product.image} alt={product.name} /><div className="cart-line-copy"><p className="eyebrow">{product.category}</p><h2><Link href={`/product/${product.slug}`}>{product.name}</Link></h2><p>{line.color} · Size {line.size}</p><strong>{currency(product.price)}</strong><div className="quantity"><button onClick={() => updateQuantity(line.lineId, line.quantity - 1)} aria-label="Reduce quantity">−</button><span>{line.quantity}</span><button onClick={() => updateQuantity(line.lineId, line.quantity + 1)} aria-label="Increase quantity">+</button></div></div><button className="remove-line" onClick={() => removeFromCart(line.lineId)} aria-label={`Remove ${product.name}`}>Remove</button></article>; })}</div><aside className="cart-side"><p className="eyebrow">Order summary</p><div className="coupon-box"><label htmlFor="coupon">Have a code?</label><div><input id="coupon" value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="STYLE10" /><button onClick={() => setCouponMessage(coupon.toUpperCase() === "STYLE10" ? "STYLE10 applied — 10% off up to ₹400." : "Try STYLE10 for 10% off up to ₹400.")}>Apply</button></div>{couponMessage && <small>{couponMessage}</small>}</div><CartTotals coupon={coupon} /><Link href={`/checkout?coupon=${coupon}`} className="button button-dark">Proceed to checkout <span>→</span></Link><Link href="/shop" className="text-link">Continue shopping →</Link></aside></div></div>;
}

export function CheckoutPage() {
  const router = useRouter();
  const { cart, customer, placeOrder } = useStore();
  const [coupon, setCoupon] = useState("");
  const [payment, setPayment] = useState<"Cash on Delivery" | "UPI">("Cash on Delivery");
  const [error, setError] = useState("");
  if (!cart.length) return <EmptyPage eyebrow="Nothing to checkout" title="Your bag is waiting for a good choice." href="/shop" action="Shop now" />;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const required = ["name", "email", "phone", "address"];
    if (required.some((field) => !String(data.get(field) || "").trim())) { setError("Please complete your delivery details."); return; }
    const order = placeOrder({ name: String(data.get("name")), email: String(data.get("email")), phone: String(data.get("phone")), address: String(data.get("address")) }, payment, coupon);
    if (order) router.push(`/order/${order.id}`);
  };
  return <div className="checkout-page"><div className="page-heading"><p className="eyebrow">Secure checkout</p><h1>YOUR ORDER,<br /><i>NEARLY THERE.</i></h1></div><form className="checkout-layout" onSubmit={submit}><div className="checkout-fields"><section><p className="eyebrow">01 / Contact</p><div className="form-grid"><label>Full name<input name="name" defaultValue={customer?.name} placeholder="Your name" /></label><label>Email<input name="email" type="email" defaultValue={customer?.email} placeholder="you@email.com" /></label><label>Phone<input name="phone" type="tel" placeholder="Your mobile number" /></label><label className="full-span">Delivery address<textarea name="address" placeholder="House, street, area, city, PIN" /></label></div></section><section><p className="eyebrow">02 / Payment</p><div className="payment-choices"><label className={payment === "Cash on Delivery" ? "selected" : ""}><input type="radio" checked={payment === "Cash on Delivery"} onChange={() => setPayment("Cash on Delivery")} />Cash on delivery <small>Pay when your order arrives</small></label><label className={payment === "UPI" ? "selected" : ""}><input type="radio" checked={payment === "UPI"} onChange={() => setPayment("UPI")} />UPI <small>Secure payment link after confirmation</small></label></div></section>{error && <p className="form-error">{error}</p>}</div><aside className="checkout-summary"><p className="eyebrow">Order summary</p><div className="checkout-coupon"><label htmlFor="checkout-code">Promo code</label><input id="checkout-code" value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="STYLE10" /><small>{coupon && coupon.toUpperCase() !== "STYLE10" ? "That code isn’t active. Try STYLE10." : "STYLE10 saves 10% up to ₹400."}</small></div><CartTotals coupon={coupon} /><button className="button button-dark" type="submit">Place order <span>→</span></button><p className="checkout-note">By placing your order, you agree to our delivery and return policy. Your order is reserved from current stock.</p></aside></form></div>;
}

export function WishlistPage() {
  const { products, wishlist, toggleWishlist, addToCart } = useStore();
  const saved = products.filter((product) => wishlist.includes(product.id));
  if (!saved.length) return <EmptyPage eyebrow="Saved styles" title="Your wishlist is waiting for better style." href="/shop" action="Explore collections" />;
  return <div className="wishlist-page section"><div className="section-heading"><div><p className="eyebrow">Saved styles</p><h1>YOUR<br /><i>WISHLIST.</i></h1></div><button className="text-button" onClick={() => saved.forEach((product) => addToCart(product.id, product.sizes[0], product.colors[0]))}>Move all available to bag →</button></div><div className="product-grid">{saved.map((product) => <div key={product.id} className="wishlist-card"><ProductCard product={product} /><button onClick={() => toggleWishlist(product.id)}>Remove from wishlist</button></div>)}</div></div>;
}

export function AccountPage({ tab = "overview" }: { tab?: "overview" | "orders" }) {
  const { customer, orders, signIn, signOut } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
  if (!customer) return <div className="account-gate"><div><p className="eyebrow">Your Sanskriti account</p><h1>STYLE, <i>KEPT CLOSE.</i></h1><p>Save your favourites, see every order and keep your next look within reach.</p></div><form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const name = String(data.get("name") || (mode === "login" ? "Sanskriti Shopper" : "")).trim(); const email = String(data.get("email") || "").trim(); if (!name || !email) { setMessage("Please add your name and email."); return; } signIn(name, email); }}><p className="eyebrow">{mode === "login" ? "Welcome back" : "Create your account"}</p>{mode === "register" && <label>Name<input name="name" placeholder="Your name" required /></label>}<label>Email<input name="email" type="email" placeholder="you@email.com" required /></label><label>Password<input type="password" placeholder="Your password" required /></label>{message && <p className="form-error">{message}</p>}<button className="button button-dark" type="submit">{mode === "login" ? "Sign in" : "Create account"} <span>→</span></button><button type="button" className="text-button" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}</button><small className="demo-note">Demo mode: account preferences are saved only in this browser.</small></form></div>;
  return <div className="account-page"><div className="account-header"><p className="eyebrow">My account</p><h1>Hello, <i>{customer.name.split(" ")[0]}.</i></h1><button className="text-button" onClick={signOut}>Sign out</button></div><div className="account-layout"><aside><Link className={tab === "overview" ? "active" : ""} href="/account">Overview</Link><Link className={tab === "orders" ? "active" : ""} href="/account/orders">Orders</Link><Link href="/wishlist">Wishlist</Link><Link href="/contact">Store support</Link></aside><section>{tab === "orders" ? <OrdersList /> : <><div className="account-welcome"><p className="eyebrow">Member edit</p><h2>Your next good look starts here.</h2><p>Thanks for shopping Sanskriti Mall. Your saved styles and orders stay together in one easy place.</p><Link href="/shop" className="button button-dark">Explore new arrivals</Link></div><OrdersList limit={2} /></>}</section></div></div>;
}

export function OrdersList({ limit }: { limit?: number }) {
  const { orders } = useStore();
  const visible = limit ? orders.slice(0, limit) : orders;
  if (!visible.length) return <div className="account-empty"><p className="eyebrow">No orders yet</p><h2>The new edit is ready.</h2><Link className="text-link" href="/shop">Shop the collection →</Link></div>;
  return <div className="orders-list"><div className="orders-heading"><p className="eyebrow">Orders</p>{limit && <Link href="/account/orders">View all →</Link>}</div>{visible.map((order) => <Link className="order-row" href={`/order/${order.id}`} key={order.id}><div><small>{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</small><strong>{order.id}</strong></div><div><small>Status</small><span className="status-pill">{order.status}</span></div><div><small>Total</small><strong>{currency(order.total)}</strong></div><span>→</span></Link>)}</div>;
}

export function OrderPage({ id }: { id: string }) {
  const { orders, products, settings } = useStore();
  const order = orders.find((item) => item.id === id);
  if (!order) return <EmptyPage eyebrow="Order lookup" title="We can’t find that order on this device." href="/account/orders" action="See my orders" />;
  const stages = ["Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"];
  const stage = stages.indexOf(order.status);
  return <div className="order-page"><div className="order-confirmation"><p className="eyebrow">Order confirmed</p><h1>THANK YOU,<br /><i>{order.customer.name.split(" ")[0]}.</i></h1><p>Your order <strong>{order.id}</strong> is safely with our team. We’ll be in touch as it moves.</p></div><div className="order-layout"><section><p className="eyebrow">Tracking timeline</p><div className="order-timeline">{stages.map((label, index) => <div className={index <= stage ? "done" : ""} key={label}><span>{index < stage ? "✓" : index + 1}</span><p>{label}</p></div>)}</div><div className="order-items"><p className="eyebrow">Your pieces</p>{order.items.map((line) => { const product = productById(products, line.productId); return product && <div key={line.lineId}><img src={product.image} alt="" /><p>{product.name}<small>{line.color} · {line.size} · Qty {line.quantity}</small></p><strong>{currency(product.price * line.quantity)}</strong></div>; })}</div></section><aside><p className="eyebrow">Delivery to</p><p>{order.customer.name}<br />{order.customer.address}<br />{order.customer.phone}</p><p className="eyebrow">Payment</p><p>{order.payment}</p><CartOrderTotals order={order} /><a className="button button-dark" target="_blank" rel="noreferrer" href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hi Sanskriti Mall, I need an update on order ${order.id}.`)}`}>Need help? WhatsApp us</a></aside></div></div>;
}

function CartOrderTotals({ order }: { order: { subtotal: number; discount: number; shipping: number; total: number } }) { return <div className="cart-totals"><p><span>Subtotal</span><strong>{currency(order.subtotal)}</strong></p>{order.discount > 0 && <p><span>Discount</span><strong>−{currency(order.discount)}</strong></p>}<p><span>Shipping</span><strong>{order.shipping ? currency(order.shipping) : "Free"}</strong></p><p className="total-line"><span>Total</span><strong>{currency(order.total)}</strong></p></div>; }

export function InfoPage({ type }: { type: "about" | "contact" | "search" }) {
  const { products, settings } = useStore();
  const [query, setQuery] = useState("");
  const matches = products.filter((product) => `${product.name} ${product.category} ${product.occasion.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  if (type === "search") return <div className="search-page"><div className="catalog-hero"><p className="eyebrow">Search the edit</p><h1>FIND YOUR<br /><i>FREQUENCY.</i></h1><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search linen, co-ord, office..." /></div>{query && <section className="section"><p className="eyebrow">{matches.length} result{matches.length === 1 ? "" : "s"}</p><div className="product-grid">{matches.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>}</div>;
  if (type === "about") return <div className="about-page"><section className="about-hero"><p className="eyebrow light">Sanskriti Mall / Badora</p><h1>STYLE THAT<br /><i>STAYS REAL.</i></h1><p>We started with a simple idea: the best-dressed version of you should still feel like you.</p></section><section className="about-story"><div><p className="eyebrow">Our point of view</p><h2>Premium fashion<br />that feels <i>within reach.</i></h2></div><div><p>Sanskriti Mall brings together modern men’s fashion, good fabrics and honest value for the way Betul dresses now. From sharp office days to festive evenings, each edit is chosen for comfort, confidence and repeat wear.</p><p>Come in for a fit check, styling advice or just a better version of your usual.</p><Link className="button button-dark" href="/contact">Visit the store</Link></div></section></div>;
  return <div className="contact-page"><section className="contact-hero"><p className="eyebrow light">Store support / personal styling</p><h1>LET’S FIND<br /><i>YOUR LOOK.</i></h1><p>Need a size, a style recommendation or a quick stock check? We’re here.</p></section><section className="contact-details"><div><p className="eyebrow">Visit</p><h2>{settings.name}</h2><p>{settings.address}</p><p>{settings.hours}</p><a className="text-link" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}>Get directions ↗</a></div><div><p className="eyebrow">Speak to us</p><a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a><a href={`mailto:${settings.email}`}>{settings.email}</a><a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp the store ↗</a></div><form onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); alert("Thanks — the Sanskriti Mall team will get back to you shortly."); }}><p className="eyebrow">Send a note</p><label>Name<input required placeholder="Your name" /></label><label>Phone<input required type="tel" placeholder="Your phone" /></label><label>How can we help?<textarea required placeholder="Tell us what you’re looking for" /></label><button className="button button-dark">Send enquiry <span>→</span></button></form></section></div>;
}

function EmptyPage({ eyebrow, title, href, action }: { eyebrow: string; title: string; href: string; action: string }) { return <div className="empty-page"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><Link className="button button-dark" href={href}>{action} <span>→</span></Link></div>; }
