import type { Metadata } from "next";
import Analytics from "@/components/Analytics";
export const metadata: Metadata = { title: "Usage Analytics" };
export default function Page() { return <Analytics />; }
