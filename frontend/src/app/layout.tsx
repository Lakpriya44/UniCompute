import type { Metadata } from "next";
import { Suspense } from "react";
import SiteLayout from "@/components/SiteLayout";
import { Loading } from "@/components/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "UniCompute | Research workspace", template: "%s | UniCompute" },
  description: "Your high-performance computing workspace. Submit research jobs, explore resources, and manage computing credits.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><Suspense fallback={<Loading />}><SiteLayout>{children}</SiteLayout></Suspense></body>
    </html>
  );
}
