"use client";

import React, { useEffect, useState } from "react";

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
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

function ProjectTableOfContents({
  title = "Contents",
  items,
}: ProjectTableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TableOfContentsItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items && items.length > 0) {
      setTocItems(items);
      return;
    }

    const usedIds = new Map<string, number>();

    const makeUniqueId = (baseId: string) => {
      const cleanId = baseId || "section";
      const count = usedIds.get(cleanId) || 0;

      usedIds.set(cleanId, count + 1);

      if (count === 0) {
        return cleanId;
      }

      return `${cleanId}-${count + 1}`;
    };

    const headingElements = Array.from(
      document.querySelectorAll<HTMLElement>("article h2, article h3")
    );

    const generatedItems = headingElements
      .map((heading) => {
        const text = heading.textContent?.trim() || "";

        if (!text) {
          return null;
        }

        const baseId = heading.id || slugify(text);
        const uniqueId = makeUniqueId(baseId);

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
      let currentId = "";

      for (const item of tocItems) {
        const element = document.getElementById(item.id);

        if (!element) {
          continue;
        }

        const rect = element.getBoundingClientRect();

        if (rect.top <= 130) {
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

    const headerOffset = 110;
    const position = element.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={title}
      style={{
        position: "fixed",
        top: "110px",
        bottom: "24px",
        left: "24px",
        width: "230px",
        overflowY: "auto",
        overflowX: "hidden",
        direction: "rtl",
        paddingLeft: "8px",
        paddingRight: "12px",
        zIndex: 20,
      }}
    >
      <div
        style={{
          direction: "ltr",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <p
          style={{
            margin: "0 0 8px 0",
            fontSize: "13px",
            fontWeight: 600,
            opacity: 0.7,
          }}
        >
          {title}
        </p>

        {tocItems.map((item, index) => {
          const itemText = item.title || item.text || item.label || item.id;
          const isActive = activeId === item.id;

          return (
            <button
              key={`${item.id}-${index}`}
              type="button"
              onClick={() => scrollToItem(item.id)}
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                padding: item.level === 3 ? "6px 8px 6px 22px" : "6px 8px",
                borderRadius: "8px",
                fontSize: item.level === 3 ? "13px" : "14px",
                lineHeight: "1.35",
                opacity: isActive ? 1 : 0.65,
                fontWeight: isActive ? 600 : 400,
                color: "inherit",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.opacity = "1";
                event.currentTarget.style.background = "rgba(128, 128, 128, 0.12)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.opacity = isActive ? "1" : "0.65";
                event.currentTarget.style.background = "transparent";
              }}
            >
              {itemText}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default ProjectTableOfContents;
export { ProjectTableOfContents };