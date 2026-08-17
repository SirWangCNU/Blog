"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, returnTo }),
      });
      const data = await response.json() as { success?: boolean; redirectTo?: string; error?: string };
      if (!response.ok || !data.success) {
        setError(data.error || "登录失败，请稍后重试");
        return;
      }
      router.push(data.redirectTo || "/admin");
      router.refresh();
    } catch {
      setError("登录失败，请检查网络后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="admin-login-form" onSubmit={handleSubmit}>
      <label>
        <span>管理员账号</span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          autoFocus
        />
      </label>
      <label>
        <span>密码</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      {error && <p className="admin-login-error" role="alert">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? "正在登录…" : "登录管理台"}
      </button>
    </form>
  );
}
