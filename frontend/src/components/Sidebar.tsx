
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Cpu,
  LayoutDashboard,
  SquarePlus,
  ListTodo,
  Wallet,
  Headphones,
  Server,
  ChartNoAxesCombined,
  BookOpen,
  Bell,
  UserRound,
  X,
  FolderOpen,
  LogOut,
} from "lucide-react";

// Sidebar navigation sections
const sections = [
  {
    label: "WORKSPACE",
    items: [
      {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
      {
        name: "Submit Job",
        href: "/jobs/new",
        icon: SquarePlus,
      },
      {
        name: "My Jobs",
        href: "/jobs",
        icon: ListTodo,
      },
      {
        name: "Resources",
        href: "/resources",
        icon: Server,
      },
      {
        name: "Files & Storage",
        href: "/files",
        icon: FolderOpen,
      },
    ],
  },
  {
    label: "MANAGE",
    items: [
      {
        name: "Credit Wallet",
        href: "/credits",
        icon: Wallet,
      },
      {
        name: "Usage Analytics",
        href: "/analytics",
        icon: ChartNoAxesCombined,
      },
      {
        name: "Notifications",
        href: "/notifications",
        icon: Bell,
      },
    ],
  },
  {
    label: "HELP & ACCOUNT",
    items: [
      {
        name: "Documentation",
        href: "/docs",
        icon: BookOpen,
      },
      {
        name: "Support",
        href: "/support",
        icon: Headphones,
      },
      {
        name: "Profile & Security",
        href: "/profile",
        icon: UserRound,
      },
    ],
  },
];

// Sidebar component
export default function Sidebar({
  open = false,
  onNavigate,
}: {
  open?: boolean;
  onNavigate?: () => void;
}) {
  const path = usePathname();

  return (
    <aside
      id="workspace-navigation"
      className={`sidebar ${open ? "is-open" : ""}`}
      aria-label="Workspace navigation"
    >
      {/* UniCompute Logo */}
      <Link
        href="/"
        className="sidebar-logo"
        onClick={onNavigate}
      >
        <Cpu size={31} />

        <div>
          <h2>UniCompute</h2>
          <small>RESEARCH WITHOUT LIMITS</small>
        </div>
      </Link>

      {/* Mobile Close Button */}
      <button
        type="button"
        className="icon-button menu-toggle sidebar-close"
        onClick={onNavigate}
        aria-label="Close navigation"
      >
        <X size={18} />
      </button>

      {/* Navigation Menu */}
      <nav aria-label="Main navigation">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="nav-label">
              {section.label}
            </p>

            {section.items.map(
              ({ name, href, icon: Icon }) => {
                const active =
                  href === "/jobs"
                    ? path === "/jobs" ||
                      (path.startsWith("/jobs/") &&
                        path !== "/jobs/new")
                    : path === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`menu-link ${
                      active ? "active" : ""
                    }`}
                    aria-current={
                      active ? "page" : undefined
                    }
                    onClick={onNavigate}
                  >
                    <Icon size={19} />
                    <span>{name}</span>
                  </Link>
                );
              }
            )}
          </div>
        ))}
      </nav>

      {/* Sidebar Bottom Section */}
      <div className="sidebar-bottom">

        {/* Cluster Status */}
        <div className="cluster-status">
          <p>
            <span className="dot" />
            Mock HPC Cluster
          </p>

          <small>
            Development environment
          </small>
        </div>

        {/* Logout Button */}
        <Link
          href="/login"
          className="logout-button"
          onClick={onNavigate}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </Link>

      </div>
    </aside>
  );
}
