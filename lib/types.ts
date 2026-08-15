export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  colors: string[];
  sizes: string[];
  stock: number;
  fabric: string;
  occasion: string[];
  fit: "Slim" | "Regular" | "Relaxed";
  image: string;
  imageAlt: string;
  isNew?: boolean;
  isTrending?: boolean;
  description: string;
};

export type CartItem = {
  lineId: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: "Confirmed" | "Packed" | "Shipped" | "Out for delivery" | "Delivered";
  payment: "Cash on Delivery" | "UPI";
  customer: { name: string; email: string; phone: string; address: string };
};

export type StoreSettings = {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  instagram: string;
  shippingThreshold: number;
};
