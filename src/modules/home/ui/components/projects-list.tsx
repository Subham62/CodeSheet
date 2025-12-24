// "use client"
// import { Button } from "@/components/ui/button";
// import { useTRPC } from "@/trpc/client"
// import { useUser } from "@clerk/nextjs";
// import { useQuery } from "@tanstack/react-query";
// import { formatDistanceToNow } from "date-fns";
// import Image from "next/image";
// import Link from "next/link";

// export const ProjectList = () => {
//     const trpc = useTRPC();
//     const {data: projects} = useQuery(trpc.projects.getMany.queryOptions());
//     const {user} = useUser();

//     if(!user)   return null;
    
//     return(
//         <div className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4">
//             <h2 className="text-2xl font-semibold">
//                 {user?.firstName}&apos;s CodeSheets
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                 {projects?.length === 0 && (
//                     <div className="col-span-full text-center">
//                         <p className="text-sm text-muted-foreground">
//                             No projects found
//                         </p>
//                     </div>
//                 )}
//                 {projects?.map((project) => (
//                     <Button
//                     key={project.id}
//                     variant="outline"
//                     className="font-normal h-auto justify-start w-full text-start p-4"
//                     asChild
//                     >
//                         <Link href={`/projects/${project.id}`}>
//                             <div className="flex items-center gap-x-4">
//                                 <Image
//                                     src="/logo.svg"
//                                     alt="CodeSheet"
//                                     width={32}
//                                     height={32}
//                                     className="object-contain"
//                                 />
//                                 <div className="flex flex-col">
//                                     <h3 className="truncate font-medium">
//                                         {project.name}
//                                     </h3>
//                                     <p className="text-sm text-muted-foreground">
//                                         {formatDistanceToNow(project.updatedAt,{
//                                             addSuffix: true,
//                                         })}
//                                     </p>
//                                 </div>
//                             </div>
//                         </Link>
//                     </Button>
//                 ))}
//             </div>
//         </div>
//     );
// }

"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EditProjectDialog } from "@/modules/home/ui/components/edit-project-dialog";
import { DeleteProjectDialog } from "@/modules/home/ui/components/delete-project-dialog";

export const ProjectList = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  const { user } = useUser();

  // Track which project is being edited
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectName, setEditingProjectName] = useState<string>("");

  // Track which project is being deleted
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null
  );
  const [deletingProjectName, setDeletingProjectName] = useState<string>("");

  const togglePublish = useMutation(
    trpc.projects.togglePublish.mutationOptions({
      onSuccess: (data) => {
        toast.success(
          data.isPublished
            ? "Project published successfully"
            : "Project unpublished"
        );
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        queryClient.invalidateQueries(
          trpc.projects.getPublished.queryOptions()
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  if (!user) return null;

  return (
    <>
      <div className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4">
        <h2 className="text-2xl font-semibold">
          {user?.firstName}&apos;s CodeSheets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.length === 0 && (
            <div className="col-span-full text-center">
              <p className="text-sm text-muted-foreground">No projects found</p>
            </div>
          )}
          {projects?.map((project) => (
            <div
              key={project.id}
              className="relative border rounded-lg p-4 bg-background hover:shadow-md transition-shadow flex flex-col gap-4"
            >
              {/* Project Content */}
              <Link href={`/projects/${project.id}`} className="block">
                <div className="flex items-start gap-x-4">
                  <Image
                    src="/logo.svg"
                    alt="CodeSheet"
                    width={32}
                    height={32}
                    className="object-contain flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <h3 className="truncate font-medium text-base">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(project.updatedAt, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </Link>

              {/* Divider */}
              <div className="border-t" />

              {/* Actions Row */}
              <div className="flex items-center justify-between gap-2">
                {/* Left side - Action buttons */}
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingProjectId(project.id);
                      setEditingProjectName(project.name);
                    }}
                    title="Rename project"
                  >
                    <Edit2Icon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      setDeletingProjectId(project.id);
                      setDeletingProjectName(project.name);
                    }}
                    title="Delete project"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>

                {/* Right side - Published toggle */}
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`publish-${project.id}`}
                    className={cn(
                      "text-xs font-medium cursor-pointer transition-colors",
                      project.isPublished
                        ? "text-green-600 dark:text-green-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {project.isPublished ? "Published" : "Private"}
                  </Label>
                  <Switch
                    id={`publish-${project.id}`}
                    checked={project.isPublished}
                    onCheckedChange={() => {
                      togglePublish.mutate({ projectId: project.id });
                    }}
                    disabled={togglePublish.isPending}
                    className={cn(
                      "data-[state=checked]:bg-green-600",
                      togglePublish.isPending && "opacity-50"
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      {editingProjectId && (
        <EditProjectDialog
          projectId={editingProjectId}
          currentName={editingProjectName}
          open={!!editingProjectId}
          onOpenChange={(open) => {
            if (!open) {
              setEditingProjectId(null);
              setEditingProjectName("");
            }
          }}
        />
      )}

      {/* Delete Dialog */}
      {deletingProjectId && (
        <DeleteProjectDialog
          projectId={deletingProjectId}
          projectName={deletingProjectName}
          open={!!deletingProjectId}
          onOpenChange={(open) => {
            if (!open) {
              setDeletingProjectId(null);
              setDeletingProjectName("");
            }
          }}
        />
      )}
    </>
  );
};
