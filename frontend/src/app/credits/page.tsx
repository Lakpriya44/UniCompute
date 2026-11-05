import type { Metadata } from "next";
import CreditWallet from "@/components/CreditWallet";
export const metadata: Metadata = { title: "Credit Wallet" };
export default function Page() { return <CreditWallet />; }
