"use client";

import { useEffect, useState } from "react";
import styles from "./ProjectTableOfContents.module.scss";

export type TableOfContentsItem = {
  id: string;
  title?: string;
  text?: string;
  label?: string;
  level?: number;
};

type ProjectTableOfContentsProps = {
  title?: string;
  items?: TableOfContentsItem[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeUniqueItems(items: TableOfContentsItem[]) {
  const usedIds = new Map<string, number>();

  return items.map((item) => {
    const baseId = slugify(item.id || item.title || item.text || item.label || "section") || "section";
    const count = usedIds.get(baseId) || 0;
    usedIds.set(baseId, count + 1);

    return {
      ...item,
      id: count === 0 ? baseId : `${baseId}-${count + 1}`,
    };
  });
}

function ProjectTableOfContents({ title = "Contents", items }: ProjectTableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TableOfContentsItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (items && items.length > 0) {
      setTocItems(makeUniqueItems(items));
      return;
    }

    const usedIds = new Map<string, number>();
    const headings = Array.from(document.querySelectorAll<HTMLElement>("article h2, article h3, article h4"));

    const generatedItems = headings
      .map((heading) => {
        const text = heading.textContent?.trim() || "";

        if (!text) {
          return null;
        }

        const baseId = slugify(text) || slugify(heading.id) || "section";
        const count = usedIds.get(baseId) || 0;
        usedIds.set(baseId, count + 1);

        const uniqueId = count === 0 ? baseId : `${baseId}-${count + 1}`;
        heading.id = uniqueId;

        return {
          id: uniqueId,
          text,
          level: Number(heading.tagName.replace("H", "")),
        };
      })
      .filter(Boolean) as TableOfContentsItem[];

    setTocItems(generatedItems);
  }, [items]);

  useEffect(() => {
    if (tocItems.length === 0) {
      return;
    }

    const updateActiveItem = () => {
      let currentId = tocItems[0]?.id || "";

      for (const item of tocItems) {
        const element = document.getElementById(item.id);

        if (!element) {
          continue;
        }

        if (element.getBoundingClientRect().top <= 140) {
          currentId = item.id;
        }
      }

      setActiveId(currentId);
    };

    updateActiveItem();

    window.addEventListener("scroll", updateActiveItem, { passive: true });
    window.addEventListener("resize", updateActiveItem);

    return () => {
      window.removeEventListener("scroll", updateActiveItem);
      window.removeEventListener("resize", updateActiveItem);
    };
  }, [tocItems]);

  const scrollToItem = (id: string) => {
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    const headerOffset = 120;
    const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <aside className={`${styles.toc} ${!isOpen ? styles.collapsed : ""}`}>
      <div className={styles.inner}>
        <button
          type="button"
          className={`${styles.toggle} ${isOpen ? styles.toggleOpen : ""}`}
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls="project-table-of-contents"
        >
          {isOpen ? "Hide contents" : "Contents"}
        </button>

        {isOpen && (
          <nav id="project-table-of-contents" className={styles.panel} aria-label={title}>
            <p className={styles.title}>{title}</p>

            <div className={styles.list}>
              {tocItems.map((item, index) => {
                const itemText = item.title || item.text || item.label || item.id;
                const levelClass =
                  item.level === 4 ? styles.level4 : item.level === 3 ? styles.level3 : "";
                const activeClass = activeId === item.id ? styles.active : "";

                return (
                  <button
                    key={`${item.id}-${index}`}
                    type="button"
                    className={`${styles.item} ${levelClass} ${activeClass}`}
                    onClick={() => scrollToItem(item.id)}
                  >
                    {itemText}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </aside>
  );
}

export default ProjectTableOfContents;
export { ProjectTableOfContents };
