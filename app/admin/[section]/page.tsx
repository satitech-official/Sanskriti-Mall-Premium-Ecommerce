import { AdminPanel } from "@/components/AdminPanel";

const sections = [
  "dashboard",
  "products",
  "categories",
  "orders",
  "customers",
  "coupons",
  "reviews",
  "homepage",
  "campaigns",
  "media",
  "settings",
];

export function generateStaticParams() {
  return sections.map((section) => ({ section }));
}

export default async function AdminRoute({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <AdminPanel section={section} />;
}
