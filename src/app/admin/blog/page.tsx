import { AdminRoutePlaceholder } from "@/components/admin/AdminRoutePlaceholder";

export default function AdminBlogPage() {
  return (
    <AdminRoutePlaceholder
      title="博客管理"
      description="用 Markdown 写作、预览、保存草稿并发布文章。"
      nextStep="完成管理员登录和 SQLite 内容层后，将现有文章迁移到这里，并保留原有公开链接。"
    />
  );
}
