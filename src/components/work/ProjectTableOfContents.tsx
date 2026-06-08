"use client";

import React from "react";
import { Column, Flex, Text } from "@/once-ui/components";
import styles from "./ProjectTableOfContents.module.scss";

export type ProjectTocItem = {
  title: string;
  id: string;
  level?: number;
};

type ProjectTableOfContentsProps = {
  title?: string;
  items: ProjectTocItem[];
};

export function ProjectTableOfContents({
  title = "Content",
  items,
}: ProjectTableOfContentsProps) {
  const scrollTo = (id: string, offset = 96) => {
    const element = document.getElementById(id);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <Column
        className={styles.navigation}
        left="0"
        style={{ top: "128px" }}
        position="fixed"
        paddingLeft="8"
        gap="16"
        hide="m"
        >
    
      <Text variant="label-default-s" onBackground="neutral-weak">
        {title}
      </Text>

      <Column gap="12">
        {items.map((item) => {
          const indent = Math.max((item.level ?? 2) - 2, 0);

          return (
            <Flex
              key={item.id}
              cursor="interactive"
              className={styles.item}
              gap="8"
              vertical="center"
              onClick={() => scrollTo(item.id)}
              style={{ paddingLeft: `calc(${indent} * var(--static-space-16))` }}
            >
              <Flex height="1" minWidth={indent > 0 ? "8" : "16"} background="neutral-strong" />
              <Text className={styles.linkText} variant="body-default-s">
                {item.title}
              </Text>
            </Flex>
          );
        })}
      </Column>
    </Column>
  );
}