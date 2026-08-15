"use client";

import { useEffect, useState } from "react";
import { OrderPage } from "@/components/CustomerPages";

export default function OrderLookupRoute() {
  const [id, setId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get("id") || "");
  }, []);

  if (!id) return null;
  return <OrderPage id={id} />;
}
