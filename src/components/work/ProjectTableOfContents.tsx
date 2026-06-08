"use client";

import { useEffect, useState } from "react";

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
  const [isOpen, setIsOpen] = useState(true);

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

    const headerOffset = 120;
    const position =
      element.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <aside
      style={{
        position: "sticky",
        top: "110px",
        alignSelf: "flex-start",
        width: isOpen ? "240px" : "92px",
        maxHeight: "calc(100vh - 130px)",
        flexShrink: 0,
        overflowY: isOpen ? "auto" : "visible",
        overflowX: "hidden",
        direction: "rtl",
        paddingLeft: "8px",
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
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          style={{
            width: isOpen ? "100%" : "fit-content",
            border: "1px solid rgba(128, 128, 128, 0.22)",
            background: "rgba(128, 128, 128, 0.08)",
            color: "inherit",
            cursor: "pointer",
            borderRadius: "999px",
            padding: "8px 12px",
            fontSize: "13px",
            fontWeight: 600,
            textAlign: "left",
          }}
        >
          {isOpen ? "Hide contents" : "Contents"}
        </button>

        {isOpen && (
          <nav
            aria-label={title}
            style={{
              border: "1px solid rgba(128, 128, 128, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "rgba(128, 128, 128, 0.05)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "13px",
                fontWeight: 700,
                opacity: 0.75,
              }}
            >
              {title}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
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
                      background: isActive
                        ? "rgba(128, 128, 128, 0.16)"
                        : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      padding:
                        item.level === 3
                          ? "7px 8px 7px 22px"
                          : "7px 8px",
                      borderRadius: "10px",
                      fontSize: item.level === 3 ? "13px" : "14px",
                      lineHeight: "1.35",
                      opacity: isActive ? 1 : 0.68,
                      fontWeight: isActive ? 650 : 400,
                      color: "inherit",
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.opacity = "1";
                      event.currentTarget.style.background =
                        "rgba(128, 128, 128, 0.12)";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.opacity = isActive ? "1" : "0.68";
                      event.currentTarget.style.background = isActive
                        ? "rgba(128, 128, 128, 0.16)"
                        : "transparent";
                    }}
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