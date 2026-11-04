
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main dashboard content */}
      <main className="main-content">
        <h1>Welcome to UniCompute!</h1>

        <p>
          Your High-Performance Computing workspace
          for research and simulations.
        </p>
      </main>
    </div>
  );
}
