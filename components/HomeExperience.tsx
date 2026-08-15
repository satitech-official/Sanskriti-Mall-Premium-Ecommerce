"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collections, currency } from "@/lib/catalog";
import { useStore } from "./StoreProvider";
import { ProductCard } from "./ProductCard";

const heroSlides = [
  { image: "/images/campaign/indian-hero.png", alt: "Indian model in a charcoal overshirt", location: "Badora, Betul + Madhya Pradesh", first: "A NEW", second: "WAY", third: "TO ARRIVE.", support: "Fine everyday fashion for men who prefer a quieter kind of confidence." },
  { image: "/images/campaign/hero-sun-face.png", alt: "Indian fashion model in warm sunlight", location: "Cotton Linen / 01", first: "SUN", second: "WARM", third: "LAYERS.", support: "Breathable textures and easy tailoring for days that move with you." },
  { image: "/images/campaign/hero-night-face.png", alt: "Indian fashion model in a midnight blue edit", location: "The after-hours edit", first: "AFTER", second: "DARK", third: "EASY.", support: "Built for plans after office, with no compromise on comfort." },
];

export function HomeExperience() {
  const { products, addToCart, settings } = useStore();
  const newArrivals = products.filter((product) => product.isNew).slice(0, 4);
  const [look, setLook] = useState(["sm-003", "sm-004", "sm-008"]);
  const [occasion, setOccasion] = useState("Office");
  const [fit, setFit] = useState("Regular");
  const [heroSlide, setHeroSlide] = useState(0);
  const selectedLook = look.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const total = selectedLook.reduce((sum, product) => sum + (product?.price ?? 0), 0);
  const recommendations = useMemo(() => products.filter((product) => product.occasion.includes(occasion) && product.fit === fit).slice(0, 3), [products, occasion, fit]);
  const activeHeroSlide = heroSlides[heroSlide];

  useEffect(() => {
    const interval = window.setInterval(() => setHeroSlide((current) => (current + 1) % heroSlides.length), 5200);
    return () => window.clearInterval(interval);
  }, []);

  return <>
    <section className="hero-section hero-reimagined" data-reveal data-slide={heroSlide}>
      <img key={activeHeroSlide.image} className="hero-image hero-slideshow-image" src={activeHeroSlide.image} alt={activeHeroSlide.alt} />
      <div className="hero-scrim" />
      <div className="hero-light hero-light-one" aria-hidden="true" /><div className="hero-light hero-light-two" aria-hidden="true" />
      <div className="hero-arch hero-arch-one" aria-hidden="true" /><div className="hero-arch hero-arch-two" aria-hidden="true" />
      <div className="hero-grid">
        <div className="hero-content hero-content-new">
          <div className="hero-kicker"><span /> THE SANSKRITI EDIT / 2026</div>
          <p className="hero-location">{activeHeroSlide.location}</p>
          <h1 key={activeHeroSlide.image}><span className="hero-title-quiet">{activeHeroSlide.first}</span><span>{activeHeroSlide.second}</span><i>{activeHeroSlide.third}</i></h1>
          <p key={`${activeHeroSlide.image}-support`} className="hero-support">{activeHeroSlide.support}</p>
          <div className="hero-ctas"><Link href="/shop" className="button button-light hero-primary-cta">Shop the edit <span>→</span></Link><Link href="/shop?sort=newest" className="button button-ghost-light">New arrivals <span>↗</span></Link></div>
          <div className="hero-proof"><p><b>4.9 / 5</b><span>Trusted by Betul</span></p><p><b>7 days</b><span>Easy exchanges</span></p><p><b>11 AM</b><span>Doors open daily</span></p></div>
        </div>
        <aside className="hero-edition" aria-label="Campaign detail"><p className="eyebrow light">Edition no.</p><strong>0{heroSlide + 1}</strong><span className="edition-rule" /><p>A NEW LOOK<br />EVERY FEW SECONDS.</p><div className="hero-slide-dots" aria-label="Choose a campaign slide">{heroSlides.map((slide, index) => <button key={slide.image} className={heroSlide === index ? "active" : ""} onClick={() => setHeroSlide(index)} aria-label={`Show slide ${index + 1}`} aria-pressed={heroSlide === index}><i /></button>)}</div><Link href="/collections">Explore the story <span>↗</span></Link></aside>
      </div>
      <div className="hero-bottomline"><span>SM / BETUL</span><div className="hero-status"><i /> IN STORE NOW</div><a className="hero-scroll" href="#new-arrivals"><span /> Scroll to discover</a></div>
    </section>
    <div className="marquee" aria-label="Sanskriti Mall premium men’s fashion"><div>SANSKRITI MALL <b>✦</b> PREMIUM MEN’S FASHION <b>✦</b> QUALITY <i>·</i> STYLE <i>·</i> VALUE <b>✦</b> SANSKRITI MALL <b>✦</b> PREMIUM MEN’S FASHION <b>✦</b></div></div>

    <section id="new-arrivals" className="section products-section" data-reveal><div className="section-heading"><div><p className="eyebrow">Just in</p><h2>NEW<br />ARRIVALS</h2></div><div className="section-intro"><p>Fresh styles. New season. Your next favourite look.</p><Link className="text-link" href="/shop?sort=newest">View all products →</Link></div></div><div className="product-grid">{newArrivals.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>

    <section className="section collection-section" data-reveal><div className="collection-intro"><p className="eyebrow">Find your frequency</p><h2>THE EDIT,<br /><i>YOUR WAY.</i></h2><p>Build a wardrobe that shows up as you: considered, comfortable and ready for whatever’s next.</p><Link href="/collections" className="button button-dark">Explore all collections</Link></div><div className="collection-grid">{collections.map((collection, index) => <Link href={`/shop?category=${encodeURIComponent(collection.title)}`} className={`collection-tile tile-${index + 1}`} key={collection.title}><img src={collection.image} alt={collection.title} /><span className="tile-overlay" /><div><small>0{index + 1}</small><h3>{collection.title}</h3><p>{collection.caption} <b>→</b></p></div></Link>)}</div></section>

    <section className="coord-section" data-reveal><div className="coord-visual"><img src="/images/campaign/indian-coord-editorial.png" alt="Indian male model in an olive cotton-linen co-ord set" /><span className="coord-label">01 — The all-day set</span><span className="coord-stamp">SUN / 26</span></div><div className="coord-copy"><p className="eyebrow light">The signature edit</p><h2>CO-ORD<br /><i>CULTURE.</i></h2><p className="statement">One set.<br />Endless style.</p><p>Clean lines. Easy movement. A whole look, already considered. The shortcut to looking put together without overthinking it.</p><Link href="/shop?category=Co-Ord%20Sets" className="button button-light">Discover co-ords <span>→</span></Link></div></section>

    <section className="linen-story"><div className="linen-copy"><p className="eyebrow">Cotton linen / 01</p><h2>FEEL THE<br /><i>DIFFERENCE.</i></h2><p>Light. Comfortable. Effortlessly refined. Our cotton-linen edit is made for the days when the heat is real and a sharp fit still matters.</p><div className="linen-facts"><span><b>Breathable</b>natural airflow</span><span><b>Easy care</b>everyday comfort</span><span><b>Soft texture</b>quietly elevated</span></div><Link className="text-link" href="/shop?category=Cotton%20Linen">Shop cotton linen →</Link></div><div className="linen-images"><img className="linen-main" src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1100&q=85" alt="Neutral linen menswear" /><div className="fabric-detail"><span>Fabric → texture → fit</span></div></div></section>

    <section className="office-section"><div className="office-image"><img src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1400&q=85" alt="A polished office-ready blue shirt" /></div><div className="office-copy"><p className="eyebrow">Weekday uniform</p><h2>THE<br /><i>OFFICE EDIT.</i></h2><p className="statement">Dress sharp.<br />Work smart.</p><p>Formal shirts, purposeful trousers and the smart casuals that carry you neatly from first meeting to after-hours plans.</p><Link href="/shop?category=Office%20Edit" className="button button-outline">Explore office style <span>→</span></Link></div></section>

    <section className="section builder-section"><div className="section-heading builder-heading"><div><p className="eyebrow">Your styling studio</p><h2>BUILD YOUR<br /><i>LOOK.</i></h2></div><p>Pick the pieces. We’ll bring the outfit together.</p></div><div className="look-builder"><div className="look-steps">{["Choose top", "Choose bottom", "Choose layer"].map((title, step) => <div className="look-step" key={title}><p><span>0{step + 1}</span>{title}</p><div className="look-options">{products.slice(step === 0 ? 0 : step === 1 ? 3 : 6, step === 0 ? 3 : step === 1 ? 6 : 8).map((product) => <button key={product.id} className={look[step] === product.id ? "selected" : ""} onClick={() => setLook((current) => current.map((id, index) => index === step ? product.id : id))}><img src={product.image} alt="" /><span>{product.name}<small>{currency(product.price)}</small></span></button>)}</div></div>)}</div><aside className="complete-look"><p className="eyebrow">Your complete look</p><div className="look-stack">{selectedLook.map((product, index) => product && <img key={product.id} className={`look-image look-image-${index}`} src={product.image} alt={product.name} />)}</div><div className="complete-summary"><p>{selectedLook.map((product) => product?.name).join(" + ")}</p><strong>{currency(total)}</strong></div><button className="button button-dark" onClick={() => selectedLook.forEach((product) => product && addToCart(product.id, product.sizes[0], product.colors[0]))}>Add complete look <span>→</span></button></aside></div></section>

    <section className="style-finder"><div><p className="eyebrow light">A better shortcut</p><h2>WHAT’S<br /><i>YOUR STYLE?</i></h2><p>Answer two quick questions. Meet your most useful edit.</p></div><div className="finder-questions"><fieldset><legend>01 / What’s the occasion?</legend><div>{["Office", "Casual", "Party", "Festive", "Date"].map((choice) => <button className={occasion === choice ? "selected" : ""} key={choice} onClick={() => setOccasion(choice)}>{choice}</button>)}</div></fieldset><fieldset><legend>02 / How do you like your fit?</legend><div>{["Slim", "Regular", "Relaxed"].map((choice) => <button className={fit === choice ? "selected" : ""} key={choice} onClick={() => setFit(choice)}>{choice}</button>)}</div></fieldset><div className="finder-result"><p className="eyebrow">Your style</p>{recommendations.length ? <><h3>{occasion} / {fit}</h3><p>{recommendations.map((product) => product.name).join(" · ")}</p><Link href={`/shop?occasion=${occasion}`} className="text-link light">See your edit →</Link></> : <p>Try another fit or occasion to unlock your edit.</p>}</div></div></section>

    <section className="campaign-section"><div><p className="eyebrow">Store exclusive</p><h2>WEEKEND<br /><i>STYLE DROP.</i></h2><p>Buy any two pieces from the latest edit and get up to 15% off at the store. Ask our team to help build the pair.</p><a className="button button-dark" target="_blank" rel="noreferrer" href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi Sanskriti Mall, I’m interested in the Weekend Style Drop.")}`}>Ask on WhatsApp <span>→</span></a></div><img src="https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=1200&q=85" alt="Men’s olive smart casual style" /></section>

    <section className="section social-section"><div className="section-heading"><div><p className="eyebrow">The local style file</p><h2>STYLE ON<br /><i>INSTAGRAM.</i></h2></div><a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-link">Follow {settings.instagram} →</a></div><div className="social-grid">{products.slice(0, 6).map((product, index) => <a key={product.id} href="https://instagram.com" target="_blank" rel="noreferrer" className={`social-shot social-${index + 1}`}><img src={product.image} alt={product.name} /><span>↗</span></a>)}</div></section>

    <section className="visit-section"><div><p className="eyebrow">The physical store</p><h2>COME FIND<br /><i>YOUR STYLE.</i></h2><p>{settings.address}</p><p>{settings.hours}</p><div className="visit-actions"><a className="button button-light" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`} target="_blank" rel="noreferrer">Get directions <span>↗</span></a><a className="button button-ghost-light" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp us</a></div></div><div className="visit-art"><span>S</span><p>Everyday style, refined.</p></div></section>
  </>;
}
