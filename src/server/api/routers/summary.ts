import axios from "axios";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";
const configuration = new Configuration({
  apiKey: process.env.OPEN_API_SECRET,
});
const openai = new OpenAIApi(configuration);
export const summaryRouter = createTRPCRouter({
  getRoomSummary: protectedProcedure
    .input(
      z.object({
        roomName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const transcripts = await ctx.prisma.transcript.findMany({
        where: {
          Room: {
            name: input.roomName,
          },
        },
        include: {
          User: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      const chatLog = transcripts.map((transcript) => ({
        speaker: transcript.User?.name,
        utterance: transcript.transcription,
        timestamp: transcript.createdAt.toISOString(),
      }));
      console.log(chatLog);
      if (chatLog.length === 0) {
        return null;
      }

      const apiKey = process.env.ONEAI_API_KEY;
      console.log(chatLog);
      try {
        const config = {
          method: "POST",
          url: "https://api.oneai.com/api/v0/pipeline",
          headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
          },
          data: {
            input: chatLog,
            input_type: "conversation",
            content_type: "application/json",
            output_type: "json",
            multilingual: {
              enabled: true,
            },
            steps: [
              {
                skill: "article-topics",
              },
              {
                skill: "numbers",
              },
              {
                skill: "names",
              },
              {
                skill: "emotions",
              },
              {
                skill: "summarize",
              },
            ],
          },
        };

        const res = await axios.request(config);
        console.log(res.status);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    }),
});
