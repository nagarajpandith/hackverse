import { string, z } from "zod";
import { pusher } from "@/lib/pusher";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const pusherRouter = createTRPCRouter({});
