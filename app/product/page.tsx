"use client";

import { useEffect, useState } from "react";
import { ProductDetails } from "@/components/ProductDetails";

export default function ProductLookupRoute() {
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSlug(params.get("slug") || "");
  }, []);

  if (!slug) return null;
  return <ProductDetails slug={slug} />;
}
