import { createTRPCRouter } from "@/server/api/trpc";
import { roomsRouter } from "./routers/rooms";
import { pusherRouter } from "./routers/pusher";
import { summaryRouter } from "./routers/summary";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  rooms: roomsRouter,
  pusher: pusherRouter,
  summary: summaryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
