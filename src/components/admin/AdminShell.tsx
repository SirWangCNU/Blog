"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ADMIN_NAV_ITEMS,
  isAdminPathActive,
  type AdminNavIcon,
} from "@/lib/admin/navigation";

function AdminIcon({ name }: { name: AdminNavIcon }) {
  const paths: Record<AdminNavIcon, React.ReactNode> = {
    overview: <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />,
    posts: <path d="M6 3h9l3 3v15H6V3Zm9 0v4h4M9 11h6M9 15h6" />,
    works: <path d="M4 7h16v12H4V7Zm5 0V5h6v2M4 11h16" />,
    media: <path d="M4 5h16v14H4V5Zm0 11 4-4 3 3 2-2 7 6M15 9h.01" />,
    settings: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4m0-12.8L17 7M7 17l-1.4 1.4" />,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="admin-v2-icon" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const mobileOpen = openMenuPath === pathname;
  const current = ADMIN_NAV_ITEMS.find((item) => isAdminPathActive(pathname, item.href));

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <div className="admin-v2-layout" data-collapsed={collapsed} data-mobile-open={mobileOpen}>
      <aside
        className="admin-v2-sidebar"
        aria-label="后台侧边栏"
        data-collapsed={collapsed}
      >
        <Link href="/admin" className="admin-v2-brand" aria-label="个人博客后台首页">
          <span className="admin-v2-logo">W</span>
          <span className="admin-v2-brand-text">
            <strong>个人博客</strong>
            <small>管理后台</small>
          </span>
        </Link>

        <nav aria-label="后台主导航" className="admin-v2-nav">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = isAdminPathActive(pathname, item.href);
            return (
              <Link
                href={item.href}
                key={item.href}
                aria-current={active ? "page" : undefined}
                className="admin-v2-nav-item"
                data-active={active}
                title={collapsed ? item.label : undefined}
                onClick={() => setOpenMenuPath(null)}
              >
                <AdminIcon name={item.icon} />
                <span className="admin-v2-nav-label">{item.label}</span>
                {item.availability === "planned" && (
                  <span className="admin-v2-nav-badge">即将开放</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="admin-v2-sidebar-footer">
          <span>Blog Admin</span>
          <small>v0.1</small>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          aria-label="关闭后台导航"
          className="admin-v2-backdrop"
          onClick={() => setOpenMenuPath(null)}
        />
      )}

      <div className="admin-v2-body">
        <header className="admin-v2-topbar">
          <div className="admin-v2-topbar-left">
            <button
              type="button"
              className="admin-v2-collapse"
              aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
              aria-expanded={!collapsed}
              onClick={() => setCollapsed((value) => !value)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button
              type="button"
              className="admin-v2-mobile-menu"
              aria-label={mobileOpen ? "关闭后台导航" : "打开后台导航"}
              aria-expanded={mobileOpen}
              onClick={() => setOpenMenuPath(mobileOpen ? null : pathname)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="admin-v2-breadcrumb" aria-label="面包屑">
              <span>后台管理</span>
              <i>/</i>
              <strong>{current?.label ?? "内容管理"}</strong>
            </div>
          </div>

          <div className="admin-v2-topbar-right">
            <Link href="/" className="admin-v2-site-link">
              查看公开站点
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 5h5v5M19 5l-9 9M18 13v6H5V6h6" /></svg>
            </Link>
            <span className="admin-v2-separator" />
            <button
              type="button"
              className="admin-v2-profile"
              aria-label="退出登录"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <span>W</span>
              <strong>{loggingOut ? "正在退出" : "退出登录"}</strong>
            </button>
          </div>
        </header>

        <main className="admin-v2-content">{children}</main>
      </div>
    </div>
  );
}
