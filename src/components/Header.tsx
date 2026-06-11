"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于" },
  { href: "/projects", label: "项目" },
  { href: "/blog", label: "博客" },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
<<<<<<< HEAD
          ? "bg-header-bg backdrop-blur-md border-b border-primary/15"
=======
          ? "bg-header-bg backdrop-blur-md shadow-sm border-b border-border"
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
<<<<<<< HEAD
            className="text-lg font-mono font-bold text-foreground hover:text-primary transition-colors"
          >
            <span className="text-primary">王景皓</span>
            <span className="text-foreground-secondary text-sm ml-2">/ 博客</span>
            <span className="animate-blink ml-1 text-primary">_</span>
          </Link>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center gap-6">
=======
            className="text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            MyBlog
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
<<<<<<< HEAD
                className={`relative py-2 text-sm font-mono transition-colors ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-foreground-secondary hover:text-primary"
=======
                className={`relative py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-foreground-secondary hover:text-foreground"
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
<<<<<<< HEAD
                    style={{ boxShadow: "0 0 8px rgba(83, 216, 168, 0.5)" }}
=======
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
                  />
                )}
              </Link>
            ))}
            <ThemeToggle />
          </div>

<<<<<<< HEAD
          {/* 移动端菜单按钮 */}
=======
          {/* Mobile Menu Button */}
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
<<<<<<< HEAD
              className="p-2 text-foreground-secondary hover:text-primary"
              aria-label="切换菜单"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
=======
              className="p-2 text-foreground-secondary hover:text-foreground"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
                )}
              </svg>
            </button>
          </div>
        </div>

<<<<<<< HEAD
        {/* 移动端菜单 */}
=======
        {/* Mobile Menu */}
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
<<<<<<< HEAD
              <div className="py-4 space-y-2 border-t border-primary/15">
=======
              <div className="py-4 space-y-2 border-t border-border">
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
<<<<<<< HEAD
                    className={`block px-4 py-2 rounded font-mono text-sm transition-colors ${
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground-secondary hover:text-primary hover:bg-primary/5"
=======
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground-secondary hover:text-foreground hover:bg-background-secondary"
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
