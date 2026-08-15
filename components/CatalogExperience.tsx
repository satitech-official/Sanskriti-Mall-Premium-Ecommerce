"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { currency } from "@/lib/catalog";
import { useStore } from "./StoreProvider";
import { ProductCard } from "./ProductCard";

const categories = ["All", "Co-Ord Sets", "Cotton Linen", "Casual Wear", "Office Edit", "Formal Wear", "Festive Collection", "Smart Casuals"];

export function CatalogExperience({ title = "SHOP THE EDIT", intro = "A more considered way to find your next favourite piece.", initialCategory = "All" }: { title?: string; intro?: string; initialCategory?: string }) {
  const { products } = useStore();
  const [category, setCategory] = useState(initialCategory);
  const [occasion, setOccasion] = useState("All");
  const [fit, setFit] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [mobileFilters, setMobileFilters] = useState(false);
  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => (category === "All" || product.category === category) && (occasion === "All" || product.occasion.includes(occasion)) && (fit === "All" || product.fit === fit) && (!onlyAvailable || product.stock > 0) && `${product.name} ${product.category} ${product.fabric}`.toLowerCase().includes(query.toLowerCase()));
    return [...filtered].sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : sort === "discount" ? (b.originalPrice - b.price) - (a.originalPrice - a.price) : sort === "newest" ? Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) : Number(Boolean(b.isTrending)) - Number(Boolean(a.isTrending)));
  }, [products, category, occasion, fit, onlyAvailable, query, sort]);
  const reset = () => { setCategory("All"); setOccasion("All"); setFit("All"); setOnlyAvailable(false); setQuery(""); setSort("featured"); };

  return <div className="catalog-page"><section className="catalog-hero"><p className="eyebrow">Sanskriti Mall / online edit</p><h1>{title.split(" ").map((word, index) => <span key={word}>{index === 1 ? <i>{word}</i> : word} </span>)}</h1><p>{intro}</p></section><div className="catalog-toolbar"><button className="filter-trigger mobile-filter-trigger" onClick={() => setMobileFilters(true)}>Filter +</button><p>{visibleProducts.length} styles found</p><label>Sort <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="rating">Highest rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="discount">Best discount</option></select></label></div><div className="catalog-layout"><aside className="filters" aria-label="Product filters"><FilterControls {...{ category, setCategory, occasion, setOccasion, fit, setFit, onlyAvailable, setOnlyAvailable, query, setQuery, reset }} /></aside><div className="catalog-products">{visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><p className="eyebrow">No close matches</p><h2>Let’s reset the edit.</h2><p>Try removing a filter, or return to the latest arrivals.</p><button className="button button-dark" onClick={reset}>Reset filters</button></div>}</div></div>{mobileFilters && <div className="filter-sheet" role="dialog" aria-modal="true" aria-label="Product filters"><div className="filter-sheet-head"><h2>Filter styles</h2><button className="close-button" onClick={() => setMobileFilters(false)} aria-label="Close filters">×</button></div><FilterControls {...{ category, setCategory, occasion, setOccasion, fit, setFit, onlyAvailable, setOnlyAvailable, query, setQuery, reset }} /><button className="button button-dark filter-apply" onClick={() => setMobileFilters(false)}>See {visibleProducts.length} styles</button></div>}</div>;
}

type FilterProps = {
  category: string; setCategory: (value: string) => void; occasion: string; setOccasion: (value: string) => void; fit: string; setFit: (value: string) => void; onlyAvailable: boolean; setOnlyAvailable: (value: boolean) => void; query: string; setQuery: (value: string) => void; reset: () => void;
};

function FilterControls(props: FilterProps) {
  return <div className="filter-controls"><div className="filter-search"><label htmlFor="shop-search">Search the edit</label><input id="shop-search" value={props.query} onChange={(event) => props.setQuery(event.target.value)} placeholder="Linen shirt, formal..." /></div><fieldset><legend>Category</legend>{categories.map((item) => <button className={props.category === item ? "selected" : ""} key={item} onClick={() => props.setCategory(item)}>{item}</button>)}</fieldset><fieldset><legend>Occasion</legend>{["All", "Office", "Casual", "Weekend", "Festive", "Date", "Party", "Formal"].map((item) => <button className={props.occasion === item ? "selected" : ""} key={item} onClick={() => props.setOccasion(item)}>{item}</button>)}</fieldset><fieldset><legend>Fit</legend>{["All", "Slim", "Regular", "Relaxed"].map((item) => <button className={props.fit === item ? "selected" : ""} key={item} onClick={() => props.setFit(item)}>{item}</button>)}</fieldset><label className="checkbox-label"><input type="checkbox" checked={props.onlyAvailable} onChange={(event) => props.setOnlyAvailable(event.target.checked)} /> In stock only</label><button className="reset-link" onClick={props.reset}>Reset all</button></div>;
}

export function CollectionsExperience() {
  const { products } = useStore();
  const focus = [
    ["Co-Ord Sets", "Two pieces. One confident answer.", "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85"],
    ["Cotton Linen", "Cut for warm days and cooler plans.", "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1600&q=85"],
    ["Office Edit", "The pieces that keep pace with your calendar.", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1600&q=85"],
    ["Festive Collection", "A little more light for the special plans.", "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=85"],
  ];
  return <div className="collections-page"><section className="catalog-hero"><p className="eyebrow">Curated for every plan</p><h1>SHOP BY<br /><i>MOOD.</i></h1><p>Six considered collections, built around how you actually dress.</p></section><div className="collection-stories">{focus.map(([title, copy, image], index) => <article key={title} className={`collection-story story-${index + 1}`}><img src={image} alt={title} /><div><p className="eyebrow">0{index + 1} / {products.filter((product) => product.category === title).length || 4} pieces</p><h2>{title}</h2><p>{copy}</p><Link className="button button-light" href={`/shop?category=${encodeURIComponent(title)}`}>Explore the edit <span>→</span></Link></div></article>)}</div></div>;
}
