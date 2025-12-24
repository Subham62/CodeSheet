// "use client";
// import { useTRPC } from "@/trpc/client";
// import { useQuery } from "@tanstack/react-query";
// import { formatDistanceToNow } from "date-fns";
// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Loader2Icon } from "lucide-react";

// export default function PublishedProjectsPage() {
//   const trpc = useTRPC();
//   const { data: projects, isLoading } = useQuery(
//     trpc.projects.getPublished.queryOptions()
//   );

//   return (
//     <div className="min-h-screen pt-24 pb-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8">Published CodeSheets</h1>

//         {isLoading && (
//           <div className="flex justify-center py-12">
//             <Loader2Icon className="h-8 w-8 animate-spin" />
//           </div>
//         )}

//         {projects?.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground">No published projects yet</p>
//           </div>
//         )}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects?.map((project) => (
//             <Button
//               key={project.id}
//               variant="outline"
//               className="font-normal h-auto justify-start w-full text-start p-4 hover:shadow-lg transition-shadow"
//               asChild
//             >
//               <Link href={`/projects/${project.id}`}>
//                 <div className="flex items-center gap-x-4">
//                   <Image
//                     src="/logo.svg"
//                     alt="CodeSheet"
//                     width={32}
//                     height={32}
//                     className="object-contain"
//                   />
//                   <div className="flex flex-col min-w-0 flex-1">
//                     <h3 className="truncate font-medium">{project.name}</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {formatDistanceToNow(project.updatedAt, {
//                         addSuffix: true,
//                       })}
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             </Button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Loader2Icon, CalendarIcon, CodeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PublishedProjectsPage() {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: projects, isLoading } = useQuery(
    trpc.projects.getPublished.queryOptions()
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 hover:bg-primary/10"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Published CodeSheets
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Explore {projects?.length || 0} AI-generated projects shared by the community
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2Icon className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && projects?.length === 0 && (
          <div className="text-center py-16 border rounded-xl bg-card shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CodeIcon className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Published Projects Yet</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Be the first to share your CodeSheet with the community!
            </p>
            <Button asChild>
              <Link href="/">Create Your First Project</Link>
            </Button>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group"
            >
              <div className="border rounded-xl p-5 bg-card hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col gap-4">
                {/* Project Header */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors ring-1 ring-primary/20">
                    <Image
                      src="/logo.svg"
                      alt="CodeSheet"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 mt-1.5">
                      Published
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t" />

                {/* Project Metadata */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">
                    Updated {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
                  </span>
                </div>

                {/* Preview Snippet */}
                {project.messages?.[0] && (
                  <div className="mt-auto pt-3 border-t">
                    <p className="text-xs text-muted-foreground/80 line-clamp-2 italic">
                      &quot;{project.messages[0].content}&quot;
                    </p>
                  </div>
                )}

                {/* Hover Indicator */}
                <div className="mt-2 flex items-center gap-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-medium">View Project</span>
                  <ArrowLeftIcon className="h-3 w-3 rotate-180" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
