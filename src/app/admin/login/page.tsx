import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin, safeAdminReturnPath } from "@/lib/auth/guard";
import { LoginForm } from "./LoginForm";
import "./login.css";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  if (await getCurrentAdmin()) redirect("/admin");
  const params = await searchParams;

  return (
    <div className="admin-login-page">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <div className="admin-login-brand" aria-hidden="true">W</div>
        <p className="admin-login-kicker">个人博客</p>
        <h1 id="admin-login-title">登录管理台</h1>
        <p className="admin-login-description">管理文章、作品与媒体内容。</p>
        <LoginForm returnTo={safeAdminReturnPath(params.returnTo)} />
        <Link href="/" className="admin-login-back">返回博客首页</Link>
      </section>
    </div>
  );
}
