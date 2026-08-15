import { AdminPanel } from "@/components/AdminPanel";

export default async function AdminRoute({ params }: { params: Promise<{ section: string }> }) { const { section } = await params; return <AdminPanel section={section} />; }
