"use client";

import Link from "next/link";
import { useState } from "react";
import { currency } from "@/lib/catalog";
import { discountFor } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useStore } from "./StoreProvider";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [quick, setQuick] = useState(false);
  const wished = wishlist.includes(product.id);

  return <article className={`product-card ${compact ? "product-card-compact" : ""}`}>
    <div className="product-image-wrap">
      <Link href={`/product/${product.slug}`} className="product-image-link" aria-label={`View ${product.name}`}>
        <img src={product.image} alt={product.imageAlt} className="product-image" />
      </Link>
      <div className="product-tags">{product.isNew && <span>NEW</span>}{product.isTrending && <span>TRENDING</span>}</div>
      <button type="button" className={`heart-button ${wished ? "is-active" : ""}`} onClick={() => toggleWishlist(product.id)} aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}>{wished ? "♥" : "♡"}</button>
      <div className="product-hover-actions">
        <button type="button" onClick={() => setQuick(true)}>Quick view</button>
        <button type="button" onClick={() => addToCart(product.id, product.sizes[0], product.colors[0])}>Add to bag</button>
      </div>
    </div>
    <div className="product-copy">
      <Link href={`/product/${product.slug}`} className="eyebrow-link">{product.category}</Link>
      <div className="product-title-row"><h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3><span className="rating">★ {product.rating}</span></div>
      <div className="product-price"><strong>{currency(product.price)}</strong>{product.originalPrice > product.price && <><s>{currency(product.originalPrice)}</s><em>{discountFor(product)}% off</em></>}</div>
      <div className="swatches" aria-label={`Available colors: ${product.colors.join(", ")}`}>{product.colors.map((color) => <span key={color} title={color} style={{ backgroundColor: color.toLowerCase() === "ivory" ? "#f3ecd9" : color.toLowerCase() === "sand" ? "#c6ad86" : color.toLowerCase() === "ink" ? "#19212c" : color.toLowerCase() === "sky" ? "#87a8bd" : color.toLowerCase() === "wine" ? "#652334" : color.toLowerCase() }} />)}</div>
    </div>
    {quick && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`Quick view ${product.name}`} onMouseDown={() => setQuick(false)}><div className="quick-view" onMouseDown={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setQuick(false)} aria-label="Close quick view">×</button><img src={product.image} alt={product.imageAlt} /><div><p className="eyebrow">{product.category}</p><h2>{product.name}</h2><p>{product.description}</p><p className="quick-price">{currency(product.price)}</p><p className="small-copy">Sizes: {product.sizes.join(" · ")}</p><button className="button button-dark" onClick={() => { addToCart(product.id, product.sizes[0], product.colors[0]); setQuick(false); }}>Add to bag</button><Link className="text-link" href={`/product/${product.slug}`}>View details →</Link></div></div></div>}
  </article>;
}
