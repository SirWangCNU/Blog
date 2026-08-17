import { MotionDiv, MotionSection } from "@/components/MotionPrimitives";
import { ProjectCard } from "@/components/ProjectCard";
import { listWorks } from "@/lib/works/store";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const works = await listWorks();
  const featured = works.filter((p) => p.featured);
  const others = works.filter((p) => !p.featured);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* 页头 */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 font-mono">
          <span className="text-primary">#</span> 作品集
        </h1>
        <p className="text-lg text-foreground-secondary">
          我参与和独立完成的各类项目，涵盖AI大模型、全栈开发、计算机视觉等多个领域
        </p>
      </MotionDiv>

      {/* 精选项目 */}
      {featured.length > 0 && (
        <MotionSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-xl font-bold text-foreground mb-6 font-mono">
            <span className="text-primary">▸</span> 核心项目
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </MotionSection>
      )}

      {/* 其他项目 */}
      {others.length > 0 && (
        <MotionSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-6 font-mono">
            <span className="text-primary">▸</span> 更多作品
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </MotionSection>
      )}

      {works.length === 0 && (
        <div className="text-center py-20 text-foreground-secondary">
          <span className="text-4xl block mb-4">🚀</span>
          <p>暂无作品，请前往后台发布</p>
        </div>
      )}
    </div>
  );
}
