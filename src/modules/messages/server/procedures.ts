// import { inngest } from "@/inngest/client";
// import {prisma} from "@/lib/db";
// import { consumeCredits } from "@/lib/usage";
// import { protectedProcedure , createTRPCRouter } from "@/trpc/init";
// import { TRPCError } from "@trpc/server";
// import z from "zod";

// export const messageRouter = createTRPCRouter({
//   getMany: protectedProcedure 
//     .input(
//       z.object({
//         projectId: z.string().min(1, { message: "Project Id is required" }),
//       })
//     )
//     .query(async ({input, ctx}) => {
//       const messages = await prisma.message.findMany({
//         where: {
//           projectId: input.projectId,
//           project: {
//             userId: ctx.auth.userId
//           }
//         },
//         include: {
//           fragment: true,
//         },
//         orderBy: {
//           updatedAt: "asc",
//         },
//       });
//       return messages;
//     }),
//   create: protectedProcedure 
//     .input(
//       z.object({
//         value: z.string()
//           .min(1, { message: "Value is required" })
//           .max(1000, { message: "Value is required" }),
//         projectId: z.string().min(1, { message: "Project Id is required" }),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       const existingProject = await prisma.project.findUnique({
//         where: {
//           id: input.projectId,
//           userId: ctx.auth.userId
//         }
//       });

//       if(!existingProject){
//         throw new TRPCError({code: "NOT_FOUND", message:"Project not found"});
//       }

//       try{
//         await consumeCredits();
//       }catch(error){
//         if(error instanceof Error){
//           throw new TRPCError({code: "BAD_REQUEST", message: "Something went wrong"});
//         }else{
//           throw new TRPCError({
//             code: "TOO_MANY_REQUESTS",
//             message: "You have run out of credits"
//           })
//         }
//       }
      
//       const createdMessage = await prisma.message.create({
//         data: {
//           projectId:existingProject.id,
//           content: input.value,
//           role: "USER",
//           type: "RESULT",
//         },
//       });
//       await inngest.send({
//         name: "code-agent/run",
//         data: {
//           value: input.value,
//           projectId: input.projectId
//         },
//       });

//       return createdMessage;
//     }),
// });

import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { consumeCredits } from "@/lib/usage";
import { protectedProcedure, publicProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const messageRouter = createTRPCRouter({
  // Allow public access to published projects' messages
  getMany: publicProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project Id is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      // First check if project exists and get its publish status
      const project = await prisma.project.findUnique({
        where: { id: input.projectId },
        select: { isPublished: true, userId: true },
      });

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      // Allow access if project is published OR user is the owner
      const isOwner = ctx.auth?.userId === project.userId;
      if (!project.isPublished && !isOwner) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This project is private",
        });
      }

      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          fragment: true,
        },
        orderBy: {
          updatedAt: "asc",
        },
      });
      return messages;
    }),

  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Value is required" })
          .max(1000, { message: "Value is required" }),
        projectId: z.string().min(1, { message: "Project Id is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.auth.userId,
        },
      });

      if (!existingProject) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      // Prevent creating messages on published projects
      if (existingProject.isPublished) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot modify a published project",
        });
      }

      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
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

      const createdMessage = await prisma.message.create({
        data: {
          projectId: existingProject.id,
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });
      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });

      return createdMessage;
    }),
});
