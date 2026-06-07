import { getPosts } from "@/app/utils/utils";
import { Column } from "@/once-ui/components";
import { ProjectCard } from "@/components";
import { ProjectTableOfContents } from "@/components/work/ProjectTableOfContents";

interface ProjectsProps {
  range?: [number, number?];
  showTableOfContents?: boolean;
}

export function Projects({ range, showTableOfContents = false }: ProjectsProps) {
  let allProjects = getPosts(["src", "app", "work", "projects"]);

  const sortedProjects = allProjects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  const tocItems = displayedProjects.map((post) => ({
    title: post.metadata.title,
    id: post.slug,
    level: 2,
  }));

  return (
    <>
      {showTableOfContents && <ProjectTableOfContents title="Projects" items={tocItems} />}

      <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
        {displayedProjects.map((post, index) => (
          <Column key={post.slug} id={post.slug} fillWidth style={{ scrollMarginTop: "96px" }}>
            <ProjectCard
              priority={index < 2}
              href={`/work/${post.slug}`}
              images={post.metadata.images}
              title={post.metadata.title}
              description={post.metadata.summary}
              content={post.content}
              avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
              link={post.metadata.link || ""}
            />
          </Column>
        ))}
      </Column>
    </>
  );
}