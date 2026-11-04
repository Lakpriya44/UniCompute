
import Link from "next/link";

import {
  Cpu,
  LayoutDashboard,
  SquarePlus,
  ListTodo,
  Wallet,
  Headphones,
} from "lucide-react";

// Sidebar navigation menu items
const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Submit Job", icon: SquarePlus },
  { name: "My Jobs", icon: ListTodo },
  { name: "Billing & Credits", icon: Wallet },
  { name: "Support", icon: Headphones },
];

// Reusable Sidebar component
export default function Sidebar() {
  return (
    <aside className="sidebar">

      {/* UniCompute Logo */}
      <div className="sidebar-logo">
        <Cpu size={28} />
        <h2>UniCompute</h2>
      </div>

      {/* Navigation Menu */}
      <nav aria-label="Main navigation">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div className="menu-item" key={item.name}>
              {index === 0 ? (
                <Link href="/" className="menu-link">
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              ) : (
                <span className="menu-link">
                  <Icon size={20} />
                  <span>{item.name}</span>
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Cluster Status */}
      <div className="cluster-status">
        <p>Mock HPC Cluster</p>
        <small>Development Environment</small>
      </div>

    </aside>
  );
}
