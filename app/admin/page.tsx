"use client";

import { useEffect, useState } from "react";
import { AdminPanel } from "@/components/AdminPanel";

export default function AdminSectionRoute() {
  const [section, setSection] = useState("dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSection(params.get("section") || "dashboard");
  }, []);

  return <AdminPanel section={section} />;
}
