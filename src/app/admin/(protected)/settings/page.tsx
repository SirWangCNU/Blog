import { AdminRoutePlaceholder } from "@/components/admin/AdminRoutePlaceholder";

export default function AdminSettingsPage() {
  return (
    <AdminRoutePlaceholder
      title="网站设置"
      description="管理首页文案、导航、模块顺序与少量设计变量。"
      nextStep="内容数据库稳定后接入结构化配置，不提供任意拖拽和原始 CSS 编辑，避免破坏前台设计。"
    />
  );
}
