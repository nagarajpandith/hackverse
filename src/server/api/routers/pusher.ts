import { string, z } from "zod";
import { pusher } from "@/lib/pusher";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
export const pusherRouter = createTRPCRouter({
  sendTranscript: protectedProcedure
    .input(
      z.object({
        message: string(),
        roomName: string(),
        isFinal: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { message } = input;
      const { user } = ctx.session;
      const response = await pusher.trigger(
        input.roomName,
        "transcribe-event",
        {
          message,
          sender: user.name,
          isFinal: input.isFinal,
          senderId: user.id,
        }
      );
      try {
        await ctx.prisma.transcript.create({
          data: {
            transcription: message,
            Room: {
              connect: {
                name: input.roomName,
              },
            },
            User: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
      return response;
    }),
});
