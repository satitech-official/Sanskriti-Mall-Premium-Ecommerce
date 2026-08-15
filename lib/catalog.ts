import type { Product, StoreSettings } from "./types";

export const storeSettings: StoreSettings = {
  name: "Sanskriti Mall",
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  email: "hello@sanskritimall.in",
  address: "Badora, Betul, Madhya Pradesh, India",
  hours: "Mon–Sun · 10:30 AM–9:30 PM",
  instagram: "@sanskritimall",
  shippingThreshold: 1999,
};

export const products: Product[] = [
  {
    id: "sm-001", slug: "sandstone-linen-overshirt", name: "Sandstone Linen Overshirt", category: "Cotton Linen", price: 1899, originalPrice: 2499, rating: 4.8, reviews: 34, colors: ["Sand", "Olive"], sizes: ["S", "M", "L", "XL"], stock: 16, fabric: "Cotton Linen", occasion: ["Casual", "Weekend", "Office"], fit: "Relaxed", image: "/images/products/sandstone-linen.png", imageAlt: "Indian model in a sandstone linen overshirt", isNew: true, description: "A soft-structured overshirt cut from breathable cotton linen. Built for warm days and smart layers."
  },
  {
    id: "sm-002", slug: "midnight-utility-co-ord", name: "Midnight Utility Co-Ord", category: "Co-Ord Sets", price: 2999, originalPrice: 3699, rating: 4.9, reviews: 58, colors: ["Ink", "Stone"], sizes: ["M", "L", "XL"], stock: 9, fabric: "Cotton Twill", occasion: ["Casual", "Party", "Weekend"], fit: "Relaxed", image: "/images/products/midnight-coord.png", imageAlt: "Indian model in a midnight utility co-ord", isNew: true, isTrending: true, description: "A modern two-piece set with a clean collar, easy trouser and room to move. One set, countless plans."
  },
  {
    id: "sm-003", slug: "ivory-resort-shirt", name: "Ivory Resort Shirt", category: "Casual Wear", price: 1499, originalPrice: 1999, rating: 4.7, reviews: 27, colors: ["Ivory", "Navy"], sizes: ["S", "M", "L", "XL"], stock: 21, fabric: "Textured Cotton", occasion: ["Casual", "Date", "Weekend"], fit: "Regular", image: "/images/products/ivory-resort.png", imageAlt: "Indian model in an ivory resort shirt", isTrending: true, description: "Textured cotton, a relaxed resort collar and an easy drape. The shirt that makes a simple look feel finished."
  },
  {
    id: "sm-004", slug: "charcoal-stretch-trouser", name: "Charcoal Stretch Trouser", category: "Office Edit", price: 1799, originalPrice: 2299, rating: 4.8, reviews: 41, colors: ["Charcoal", "Taupe"], sizes: ["30", "32", "34", "36"], stock: 19, fabric: "Stretch Cotton", occasion: ["Office", "Formal", "Date"], fit: "Slim", image: "/images/products/charcoal-trouser.png", imageAlt: "Indian model wearing charcoal tailored trousers", description: "A sharp tapered trouser with enough stretch for a full workday and every plan after it."
  },
  {
    id: "sm-005", slug: "saffron-texture-shirt", name: "Saffron Texture Shirt", category: "Festive Collection", price: 2199, originalPrice: 2999, rating: 4.9, reviews: 19, colors: ["Saffron", "Wine"], sizes: ["M", "L", "XL"], stock: 7, fabric: "Viscose Blend", occasion: ["Festive", "Party", "Date"], fit: "Regular", image: "/images/products/saffron-texture.png", imageAlt: "Indian model in a saffron textured shirt", isNew: true, description: "A refined festive shirt with a low-shine texture that catches light without shouting for it."
  },
  {
    id: "sm-006", slug: "olive-camp-co-ord", name: "Olive Camp Co-Ord", category: "Co-Ord Sets", price: 2799, originalPrice: 3499, rating: 4.6, reviews: 23, colors: ["Olive", "Sand"], sizes: ["S", "M", "L", "XL"], stock: 12, fabric: "Cotton Linen", occasion: ["Casual", "Weekend", "Date"], fit: "Regular", image: "/images/campaign/indian-coord-editorial.png", imageAlt: "Indian model in an olive cotton-linen co-ord", isTrending: true, description: "Easy camp-collar proportions and matching trousers in a naturally breathable fabric."
  },
  {
    id: "sm-007", slug: "blue-pinstripe-formal-shirt", name: "Blue Pinstripe Formal Shirt", category: "Formal Wear", price: 1699, originalPrice: 2099, rating: 4.7, reviews: 46, colors: ["Sky", "White"], sizes: ["S", "M", "L", "XL"], stock: 25, fabric: "Premium Cotton", occasion: ["Office", "Formal"], fit: "Slim", image: "/images/products/blue-pinstripe.png", imageAlt: "Indian model in a blue pinstripe formal shirt", description: "Crisp pinstripes, a tailored fit and a comfortable cotton hand. An office essential with presence."
  },
  {
    id: "sm-008", slug: "stone-knit-polo", name: "Stone Knit Polo", category: "Smart Casuals", price: 1599, originalPrice: 1999, rating: 4.5, reviews: 18, colors: ["Stone", "Black"], sizes: ["M", "L", "XL"], stock: 14, fabric: "Cotton Knit", occasion: ["Office", "Casual", "Date"], fit: "Regular", image: "/images/products/stone-knit-polo.png", imageAlt: "Indian model in a stone knit polo", isNew: true, description: "A polished knit polo designed to bridge weekday polish and weekend ease."
  }
];

export const collections = [
  { title: "Co-Ord Sets", caption: "One set. Endless style.", image: products[1].image },
  { title: "Cotton Linen", caption: "Made for the heat.", image: products[0].image },
  { title: "Casual Wear", caption: "Easy, never ordinary.", image: products[2].image },
  { title: "Office Edit", caption: "Dress sharp. Work smart.", image: products[3].image },
  { title: "Formal Wear", caption: "The confident answer.", image: products[6].image },
  { title: "Festive Collection", caption: "Light up the plan.", image: products[4].image },
];

export const currency = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
