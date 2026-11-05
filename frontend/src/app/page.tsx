import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";

export default function Home() {
  return <div className="app-container"><Sidebar /><main className="dashboard-main"><Hero /></main></div>;
}
