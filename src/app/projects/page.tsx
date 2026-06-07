"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const allTags = ["全部", ...new Set(projects.flatMap((p) => p.tags))];

export default function ProjectsPage() {
  const [selectedTag, setSelectedTag] = useState("全部");

  const filteredProjects =
    selectedTag === "全部"
      ? projects
      : projects.filter((p) => p.tags.includes(selectedTag));

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          🚀 我的项目
        </h1>
        <p className="text-lg text-foreground-secondary">
          这里展示了我参与开发的各类项目
        </p>
      </motion.div>

      {/* Filter Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2 mb-10"
      >
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTag === tag
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-card text-foreground-secondary border border-border hover:border-primary/30 hover:text-primary"
            }`}
          >
            {tag}
          </button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTag}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-foreground-secondary text-lg">
            暂无符合条件的项目
          </p>
        </motion.div>
      )}
    </div>
  );
}
