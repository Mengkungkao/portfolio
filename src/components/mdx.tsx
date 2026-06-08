import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import dynamic from "next/dynamic";
import styles from "./mdx.module.scss";

import { 
  Heading,
  HeadingLink,
  SmartImage,
  SmartLink,
  Text,
  InlineCode,
} from "@/once-ui/components";

import { CodeBlock } from "@/once-ui/modules/code/CodeBlock";
import { TextProps } from "@/once-ui/interfaces";
import { SmartImageProps } from "@/once-ui/components/SmartImage";
import { FunctionTable, MathEquation } from "@/components/mdx/ProjectMdxBlocks";



type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>
        {children}
      </SmartLink>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function createImage({ alt, src }: SmartImageProps & { src: string }) {
  if (!src) {
    console.error("Image requires a valid 'src' property.");
    return null;
  }

  return (
    <figure className={styles.imageFigure}>
      <img
        className={styles.mdxImage}
        src={src}
        alt={alt || ""}
        loading="lazy"
      />
      {alt && <figcaption className={styles.imageCaption}>{alt}</figcaption>}
    </figure>
  );
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({ children, ...props }: TextProps<typeof as>) => {
    const slug = slugify(children as string);
    return (
      <HeadingLink
        style={{ marginTop: "var(--static-space-24)", marginBottom: "var(--static-space-12)" }}
        as={as}
        id={slug}
        {...props}
      >
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `${as}`;

  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}
function createTable({ children }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.mdxTable}>{children}</table>
    </div>
  );
}

function createTableHead({ children }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={styles.tableHead}>{children}</thead>;
}

function createTableBody({ children }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody>{children}</tbody>;
}

function createTableRow({ children }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr>{children}</tr>;
}

function createTableHeader({
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={styles.tableHeader} {...props}>
      {children}
    </th>
  );
}

function createTableCell({
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={styles.tableCell} {...props}>
      {children}
    </td>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}

function createCodeBlock(props: any) {
  // For pre tags that contain code blocks
  if (props.children && props.children.props && props.children.props.className) {
    const { className, children } = props.children.props;
    
    // Extract language from className (format: language-xxx)
    const language = className.replace('language-', '');
    const label = language.charAt(0).toUpperCase() + language.slice(1);
    
    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codeInstances={[
          {
            code: children,
            language,
            label
          }
        ]}
        copyButton={true}
      />
    );
  }
  
  // Fallback for other pre tags or empty code blocks
  return <pre {...props} />;
}

const components = {
  p: createParagraph as any,
  h1: createHeading("h1") as any,
  h2: createHeading("h2") as any,
  h3: createHeading("h3") as any,
  h4: createHeading("h4") as any,
  h5: createHeading("h5") as any,
  h6: createHeading("h6") as any,

  table: createTable as any,
  thead: createTableHead as any,
  tbody: createTableBody as any,
  tr: createTableRow as any,
  th: createTableHeader as any,
  td: createTableCell as any,
  
  
  img: createImage as any,
  a: CustomLink as any,
  code: createInlineCode as any,
  pre: createCodeBlock as any,
  
  Heading,
  Text,
  CodeBlock,
  InlineCode,
  
  Accordion: dynamic(() => import("@/once-ui/components").then(mod => mod.Accordion)),
  AccordionGroup: dynamic(() => import("@/once-ui/components").then(mod => mod.AccordionGroup)),
  Table: dynamic(() => import("@/once-ui/components").then(mod => mod.Table)),
  Feedback: dynamic(() => import("@/once-ui/components").then(mod => mod.Feedback)),
  Button: dynamic(() => import("@/once-ui/components").then(mod => mod.Button)),
  Card: dynamic(() => import("@/once-ui/components").then(mod => mod.Card)),
  Grid: dynamic(() => import("@/once-ui/components").then(mod => mod.Grid)),
  Row: dynamic(() => import("@/once-ui/components").then(mod => mod.Row)),
  Column: dynamic(() => import("@/once-ui/components").then(mod => mod.Column)),
  Icon: dynamic(() => import("@/once-ui/components").then(mod => mod.Icon)),
  SmartImage: dynamic(() => import("@/once-ui/components").then(mod => mod.SmartImage)),
  SmartLink: dynamic(() => import("@/once-ui/components").then(mod => mod.SmartLink)),

  FunctionTable,
  MathEquation,
  
};

type CustomMDXProps = MDXRemoteProps & {
  components?: Record<string, React.ComponentType<any>>;
};

export function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      components={{
        ...components,
        ...(props.components || {}),
      }}
    />
  );
}