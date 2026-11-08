import type { Metadata } from "next";
import Notifications from "@/components/Notifications";
export const metadata: Metadata = { title: "Notifications" };
export default function Page() { return <Notifications />; }
