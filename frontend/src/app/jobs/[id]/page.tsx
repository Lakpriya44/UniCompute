import { Suspense } from "react";
import type { Metadata } from "next";
import JobDetails from "@/components/JobDetails";
import { Loading } from "@/components/ui";
export const metadata: Metadata = { title: "Job Details" };
async function Details({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JobDetails id={id} />;
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<Loading />}><Details params={params} /></Suspense>;
}
