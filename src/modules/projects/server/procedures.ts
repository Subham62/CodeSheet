// import { inngest } from "@/inngest/client";
// import {generateSlug} from "random-word-slugs";
// import {prisma} from "@/lib/db";
// import { protectedProcedure , createTRPCRouter } from "@/trpc/init";
// import z from "zod";
// import { TRPCError } from "@trpc/server";
// import { consumeCredits } from "@/lib/usage";

// export const projectsRouter = createTRPCRouter({
//   getOne: protectedProcedure
//     .input(z.object({
//       id: z.string().min(1, {message: "Id is required"}),
//     }))
//     .query(async ({input, ctx}) => {
//       const existingProject = await prisma.project.findUnique({
//         where: {
//           id: input.id,
//           userId: ctx.auth.userId,
//         },
//       });

//       if(!existingProject)  throw new TRPCError({code: "NOT_FOUND", message: "Project not found"});
//       return existingProject;
//     }),
//   getMany: protectedProcedure
//     .query(async ({ctx}) => {
//       const projects = await prisma.project.findMany({
//         where:{
//           userId: ctx.auth.userId
//         },
//         orderBy: {
//           updatedAt: "desc",
//         },
//       });
//       return projects;
//     }),
//   create: protectedProcedure
//     .input(
//       z.object({
//         value: z.string()
//           .min(1, { message: "Value is required" })
//           .max(10000, {message: "Value is too long"}),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {

//       try{
//         await consumeCredits();
//       }catch(error){
//         if(error instanceof Error){
//           console.log(error);
//           throw new TRPCError({code: "BAD_REQUEST", message: "Something went wrong"});
//         }else{
//           throw new TRPCError({
//             code: "TOO_MANY_REQUESTS",
//             message: "You have run out of credits"
//           })
//         }
//       }

//       const createdProject = await prisma.project.create({
//         data: {
//           userId: ctx.auth.userId,
//           name: generateSlug(2, {
//             format: "kebab",
//           }),
//           messages: {
//             create: {
//               content: input.value,
//               role: "USER",
//               type: "RESULT",
//             }
//           },

//         }
//       })
//       await inngest.send({
//         name: "code-agent/run",
//         data: {
//           value: input.value,
//           projectId: createdProject.id,
//         },
//       });

//       return createdProject;
//     }),
// });

import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";
import { prisma } from "@/lib/db";
import {
  protectedProcedure,
  publicProcedure,
  createTRPCRouter,
} from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Id is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!existingProject)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      return existingProject;
    }),

  // NEW: Get project by ID (public or owner access)
  getById: publicProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.projectId },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      // Allow access if project is published OR user is the owner
      const isOwner = ctx.auth?.userId === project.userId;
      if (!project.isPublished && !isOwner) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This project is private",
        });
      }

      return project;
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return projects;
  }),

  // NEW: Get all published projects (public access)
  getPublished: publicProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { fragment: true },
        },
      },
    });
    return projects;
  }),

  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Value is required" })
          .max(10000, { message: "Value is too long" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong",
          });
        } else {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You have run out of credits",
          });
        }
      }

      const createdProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });
      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),

  // NEW: Toggle publish status
  togglePublish: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.projectId },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (project.userId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to modify this project",
        });
      }

      const updatedProject = await prisma.project.update({
        where: { id: input.projectId },
        data: { isPublished: !project.isPublished },
      });

      return updatedProject;
    }),

  // NEW: Delete project
  delete: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.projectId },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (project.userId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to delete this project",
        });
      }

      await prisma.project.delete({
        where: { id: input.projectId },
      });

      return { success: true };
    }),

  // Add this after the delete procedure
  rename: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z
          .string()
          .min(1, { message: "Name is required" })
          .max(100, { message: "Name is too long" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.projectId },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (project.userId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to rename this project",
        });
      }

      const updatedProject = await prisma.project.update({
        where: { id: input.projectId },
        data: { name: input.name },
      });

      return updatedProject;
    }),
});
