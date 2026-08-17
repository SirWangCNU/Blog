import Link from "next/link";
import type { AdminDashboardData } from "@/lib/admin/dashboard";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function AdminDashboard({ data }: { data: AdminDashboardData }) {
  const stats = [
    { label: "博客文章", value: data.stats.postsTotal, note: "当前公开文章" },
    { label: "作品总数", value: data.stats.worksTotal, note: "全部作品记录" },
    { label: "已发布作品", value: data.stats.worksPublished, note: "正在前台展示" },
    { label: "草稿", value: data.stats.worksDrafts, note: "等待继续编辑" },
  ];

  return (
    <div className="admin-dashboard-v2">
      <header className="admin-page-v2-header">
        <div>
          <h1>控制台</h1>
          <p>查看内容概况，并快速进入常用管理功能。</p>
        </div>
        <Link href="/admin/works/new" className="admin-v2-button admin-v2-button-primary">
          <span aria-hidden="true">＋</span>
          新建作品
        </Link>
      </header>

      <div className="admin-v2-alert" role="status">
        <span className="admin-v2-alert-icon" aria-hidden="true">!</span>
        <div>
          <strong>后台登录尚未启用</strong>
          <p>当前页面仅用于界面和内容管理开发，部署到服务器前需要接入登录与服务端权限校验。</p>
        </div>
      </div>

      <section className="admin-stats-v2" aria-label="内容统计">
        {stats.map((stat) => (
          <article className="admin-stat-v2" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.note}</small>
          </article>
        ))}
      </section>

      <div className="admin-dashboard-v2-grid">
        <section className="admin-card-v2 admin-recent-works-v2" aria-labelledby="recent-works-title">
          <div className="admin-card-v2-header">
            <div>
              <h2 id="recent-works-title">最近作品</h2>
              <p>最近更新的作品内容</p>
            </div>
            <Link href="/admin/works">查看全部</Link>
          </div>

          <div className="admin-table-v2-wrap">
            <table className="admin-table-v2">
              <thead>
                <tr>
                  <th>作品名称</th>
                  <th>状态</th>
                  <th>更新时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {data.recentWorks.length ? (
                  data.recentWorks.map((work) => (
                    <tr key={work.id}>
                      <td>
                        <strong>{work.title}</strong>
                        <span>{work.summary}</span>
                      </td>
                      <td>
                        <span className="admin-status-v2" data-status={work.status}>
                          {work.status === "published" ? "已发布" : "草稿"}
                        </span>
                      </td>
                      <td>{formatDate(work.updatedAt)}</td>
                      <td><Link href={work.editHref}>编辑</Link></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <div className="admin-table-v2-empty">
                        <p>还没有作品记录</p>
                        <Link href="/admin/works/new">新建第一个作品</Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-card-v2 admin-recent-posts-v2" aria-labelledby="recent-posts-title">
          <div className="admin-card-v2-header">
            <div>
              <h2 id="recent-posts-title">最近文章</h2>
              <p>当前博客中的公开内容</p>
            </div>
            <Link href="/admin/blog">管理文章</Link>
          </div>
          {data.recentPosts.length ? (
            <ul className="admin-post-list-v2">
              {data.recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={post.publicHref}>
                    <span>
                      <strong>{post.title}</strong>
                      <small>{post.category}</small>
                    </span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="admin-card-v2-empty">还没有博客文章</div>
          )}
        </section>
      </div>
    </div>
  );
}
