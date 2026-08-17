export type AdminNavIcon =
  | "overview"
  | "posts"
  | "works"
  | "media"
  | "settings";

export interface AdminNavItem {
  href: string;
  label: string;
  index: string;
  icon: AdminNavIcon;
  availability: "ready" | "planned";
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "总览", index: "01", icon: "overview", availability: "ready" },
  { href: "/admin/blog", label: "博客", index: "02", icon: "posts", availability: "ready" },
  { href: "/admin/works", label: "作品集", index: "03", icon: "works", availability: "ready" },
  { href: "/admin/media", label: "媒体库", index: "04", icon: "media", availability: "planned" },
  { href: "/admin/settings", label: "网站设置", index: "05", icon: "settings", availability: "planned" },
];

export function isAdminPathActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
