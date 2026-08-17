const SUMMARY_LIMIT = 120;

export function deriveWorkSummary(markdown: string, fallback: string): string {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*(?:[-*+]\s+|>\s?)/gm, "")
    .replace(/[~*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return (plainText || fallback.trim()).slice(0, SUMMARY_LIMIT);
}

export function insertMarkdownImage(
  markdown: string,
  start: number,
  end: number,
  alt: string,
  url: string
): { content: string; cursor: number } {
  const safeStart = Math.max(0, Math.min(start, markdown.length));
  const safeEnd = Math.max(safeStart, Math.min(end, markdown.length));
  const before = markdown.slice(0, safeStart);
  const after = markdown.slice(safeEnd);
  const safeAlt = alt.replace(/[\[\]]/g, "").trim() || "作品图片";
  const image = `![${safeAlt}](${url})`;
  const leading = !before || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
  const trailing = !after || after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
  const prefix = `${before}${leading}${image}`;

  return {
    content: `${prefix}${trailing}${after}`,
    cursor: prefix.length,
  };
}
