import { OrderPage } from "@/components/CustomerPages";

export default async function OrderRoute({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <OrderPage id={id} />; }
