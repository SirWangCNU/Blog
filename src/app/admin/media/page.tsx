import { AdminRoutePlaceholder } from "@/components/admin/AdminRoutePlaceholder";

export default function AdminMediaPage() {
  return (
    <AdminRoutePlaceholder
      title="媒体库"
      description="集中整理文章封面、作品截图和站点视觉素材。"
      nextStep="先封堵现有上传接口的权限与路径风险，再接入媒体元数据、引用检查和安全删除。"
    />
  );
}
