import type { Metadata } from "next";
import JobHistory from "@/components/JobHistory";
export const metadata: Metadata = { title: "My Jobs" };
export default function Page() { return <JobHistory />; }
