export type HeadingItem = {
  title: string;
  id: string;
  level: number;
};

export function slugifyHeading(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function cleanHeadingText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+#*$/g, "")
    .trim();
}

export function getHeadingsFromMDX(
  content: string,
  minLevel = 2,
  maxLevel = 3,
): HeadingItem[] {
  const headings: HeadingItem[] = [];
  let insideCodeBlock = false;

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }

    if (insideCodeBlock) continue;

    const match = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (!match) continue;

    const level = match[1].length;
    if (level < minLevel || level > maxLevel) continue;

    const title = cleanHeadingText(match[2]);
    if (!title) continue;

    headings.push({
      title,
      id: slugifyHeading(title),
      level,
    });
  }

  return headings;
}