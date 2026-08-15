"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { currency } from "@/lib/catalog";
import { productById } from "@/lib/utils";
import { useStore } from "./StoreProvider";
import { MotionExperience } from "./MotionExperience";

const nav = [
  ["Home", "/"], ["Shop", "/shop"], ["Collections", "/collections"], ["New arrivals", "/shop?sort=newest"], ["About", "/about"], ["Contact", "/contact"],
] as const;

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { products, cart, wishlist, settings, toast } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [query, setQuery] = useState("");
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const inHero = pathname === "/";
  const searchResults = useMemo(() => products.filter((product) => `${product.name} ${product.category} ${product.fabric}`.toLowerCase().includes(query.toLowerCase())).slice(0, 4), [products, query]);
  const bagTotal = cart.reduce((total, item) => total + (productById(products, item.productId)?.price ?? 0) * item.quantity, 0);
  const closeMenu = () => setMenuOpen(false);

  return <>
    <MotionExperience />
    <header className={`site-header ${inHero ? "on-hero" : ""}`}>
      <Link className="wordmark" href="/" onClick={closeMenu}><span>SANSKRITI</span><small>MALL · BETUL</small></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">{nav.map(([label, href]) => <Link key={label} href={href} className={pathname === href ? "active" : ""}>{label}</Link>)}</nav>
      <div className="header-actions">
        <button className="plain-icon desktop-only" onClick={() => setSearchOpen(true)} aria-label="Search products">⌕</button>
        <Link className="plain-icon desktop-only" href="/account" aria-label="Your account">◌</Link>
        <Link className="plain-icon desktop-only" href="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`}>♡<sup>{wishlist.length || ""}</sup></Link>
        <button className="bag-action" onClick={() => setBagOpen(true)} aria-label={`Shopping bag with ${cartCount} items`}>Bag <sup>{cartCount}</sup></button>
        <button className="menu-toggle mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
      </div>
    </header>
    <main>{children}</main>
    <a className="whatsapp-float" href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi Sanskriti Mall, I’d like help finding my next look.")}`} target="_blank" rel="noreferrer" aria-label="Chat with Sanskriti Mall on WhatsApp">◔ <span>Chat with us</span></a>
    <nav className="mobile-dock" aria-label="Mobile navigation"><Link href="/">⌂<small>Home</small></Link><Link href="/shop">▦<small>Shop</small></Link><button onClick={() => setSearchOpen(true)}>⌕<small>Search</small></button><Link href="/wishlist">♡<small>Saved</small></Link><button onClick={() => setBagOpen(true)}>Bag<small>{cartCount || "Cart"}</small></button></nav>
    <footer className="site-footer">
      <div className="footer-brand"><p className="eyebrow">Badora · Betul · MP</p><h2>Premium style.<br />Honest prices.</h2><p>Modern men’s fashion with the quality, fit and easy confidence you come back for.</p></div>
      <div><p className="eyebrow">Shop</p><Link href="/shop?category=Co-Ord%20Sets">Co-Ord Sets</Link><Link href="/shop?category=Cotton%20Linen">Cotton Linen</Link><Link href="/shop?category=Office%20Edit">Office Edit</Link><Link href="/shop?category=Festive%20Collection">Festive</Link></div>
      <div><p className="eyebrow">Visit</p><p>{settings.address}</p><p>{settings.hours}</p><a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a><a href={`mailto:${settings.email}`}>{settings.email}</a></div>
      <div className="footer-note"><p className="eyebrow">Follow</p><a href="https://instagram.com" target="_blank" rel="noreferrer">{settings.instagram}</a><p>© {new Date().getFullYear()} {settings.name}</p><Link href="/admin/login">Store team access</Link></div>
    </footer>
    {menuOpen && <div className="mobile-menu" role="dialog" aria-modal="true"><div className="mobile-menu-top"><span className="wordmark">SANSKRITI<small>MALL · BETUL</small></span><button className="close-button" onClick={closeMenu} aria-label="Close menu">×</button></div><div className="mobile-menu-links">{nav.map(([label, href], index) => <Link key={label} href={href} onClick={closeMenu}><span>0{index + 1}</span>{label}</Link>)}</div><div className="mobile-menu-contact"><p>Need a quick answer?</p><a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp the store →</a><p>{settings.address}</p></div></div>}
    {searchOpen && <div className="search-drawer" role="dialog" aria-modal="true" aria-label="Search Sanskriti Mall"><div className="search-top"><span className="eyebrow">Find your next look</span><button className="close-button" onClick={() => { setSearchOpen(false); setQuery(""); }} aria-label="Close search">×</button></div><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try linen shirt, co-ord, formal…" aria-label="Search products" />{query ? <div className="search-results">{searchResults.length ? searchResults.map((product) => <Link key={product.id} href={`/product/${product.slug}`} onClick={() => setSearchOpen(false)}><img src={product.image} alt="" /><span><small>{product.category}</small>{product.name}<em>{currency(product.price)}</em></span></Link>) : <p>No styles match that search yet.</p>}</div> : <div className="popular-searches"><p className="eyebrow">Popular searches</p>{["Cotton Linen", "Co-Ord Sets", "Office Edit", "Festive Collection"].map((term) => <button key={term} onClick={() => setQuery(term)}>{term}</button>)}</div>}</div>}
    {bagOpen && <BagDrawer onClose={() => setBagOpen(false)} total={bagTotal} />}
    {toast && <div className="toast" role="status">{toast}</div>}
  </>;
}

function BagDrawer({ onClose, total }: { onClose: () => void; total: number }) {
  const { cart, products, removeFromCart, updateQuantity } = useStore();
  return <div className="bag-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag"><div className="bag-head"><div><p className="eyebrow">Your selection</p><h2>Shopping bag</h2></div><button className="close-button" onClick={onClose} aria-label="Close shopping bag">×</button></div>{cart.length ? <><div className="bag-lines">{cart.map((line) => { const product = productById(products, line.productId); if (!product) return null; return <div className="bag-line" key={line.lineId}><img src={product.image} alt="" /><div><h3>{product.name}</h3><p>{line.color} · {line.size}</p><strong>{currency(product.price)}</strong><div className="quantity"><button onClick={() => updateQuantity(line.lineId, line.quantity - 1)} aria-label="Reduce quantity">−</button><span>{line.quantity}</span><button onClick={() => updateQuantity(line.lineId, line.quantity + 1)} aria-label="Increase quantity">+</button></div></div><button className="remove-line" onClick={() => removeFromCart(line.lineId)} aria-label={`Remove ${product.name}`}>×</button></div>; })}</div><div className="bag-summary"><p><span>Subtotal</span><strong>{currency(total)}</strong></p><small>Shipping is calculated at checkout.</small><Link href="/cart" onClick={onClose} className="button button-dark">View bag</Link><Link href="/checkout" onClick={onClose} className="button button-gold">Checkout</Link></div></> : <div className="empty-drawer"><p>Your bag is ready for a better look.</p><Link href="/shop" onClick={onClose} className="text-link">Explore the collection →</Link></div>}</div>;
}
