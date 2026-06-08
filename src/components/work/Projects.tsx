import { getPosts } from "@/app/utils/utils";
import { Column } from "@/once-ui/components";
import { ProjectCard } from "@/components";
import ProjectTableOfContents from "@/components/work/ProjectTableOfContents";

interface ProjectsProps {
  range?: [number, number?];
}

function createProjectId(slug: string) {
  return `project-${slug.replace(/\//g, "-")}`;
}

export function Projects({ range }: ProjectsProps) {
  const allProjects = getPosts(["src", "app", "work", "projects"]);

  const sortedProjects = allProjects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  const showTableOfContents = !range && displayedProjects.length > 0;

  const tocItems = displayedProjects.map((post) => ({
    id: createProjectId(post.slug),
    title: post.metadata.title,
  }));

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        gap: "32px",
        alignItems: "flex-start",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {showTableOfContents && <ProjectTableOfContents title="Projects" items={tocItems} />}

      <Column
        fillWidth
        gap="xl"
        marginBottom="40"
        paddingX="l"
        style={{
          flex: "1 1 680px",
          minWidth: 0,
        }}
      >
        {displayedProjects.map((post, index) => (
          <div
            key={post.slug}
            id={createProjectId(post.slug)}
            style={{
              scrollMarginTop: "120px",
            }}
          >
            <ProjectCard
              priority={index < 2}
              href={`work/${post.slug}`}
              images={post.metadata.images}
              title={post.metadata.title}
              description={post.metadata.summary}
              content={post.content}
              avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
              link={post.metadata.link || ""}
            />
          </div>
        ))}
      </Column>
    </div>
  );
}
