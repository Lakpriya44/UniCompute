import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "UniCompute | Research workspace", template: "%s | UniCompute" },
  description: "Your high-performance computing workspace. Submit research jobs, explore resources, and manage computing credits.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
