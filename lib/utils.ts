import type { Product } from "./types";

export const discountFor = (product: Product) => Math.round((1 - product.price / product.originalPrice) * 100);

export const productById = (products: Product[], id: string) => products.find((product) => product.id === id);

export const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
