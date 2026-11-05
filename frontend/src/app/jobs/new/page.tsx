import type { Metadata } from "next";
import SubmitJob from "@/components/SubmitJob";
export const metadata: Metadata = { title: "Submit HPC Job" };
export default function Page() { return <SubmitJob />; }
