"use client";

import { motion } from "framer-motion";

export const MotionArticle = motion.article;
export const MotionDiv = motion.div;
export const MotionH1 = motion.h1;
export const MotionH2 = motion.h2;
export const MotionSection = motion.section;

export function ScrollPrompt() {
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
    >
      <MotionDiv
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-white/40 text-2xl cursor-pointer"
        onClick={() =>
          document
            .getElementById("content-area")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        ▼
      </MotionDiv>
    </MotionDiv>
  );
}
