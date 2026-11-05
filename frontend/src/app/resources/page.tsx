import type { Metadata } from "next";
import Resources from "@/components/Resources";
export const metadata: Metadata = { title: "Available Resources" };
export default function Page() { return <Resources />; }
