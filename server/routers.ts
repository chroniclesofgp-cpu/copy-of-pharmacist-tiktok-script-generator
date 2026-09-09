import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { tiktokRouter } from "./routers/tiktok";
import { bofRouter } from "./routers/bof";
import { productsRouter, savedScriptsRouter } from "./routers/products";
import { vettingRouter } from "./routers/vetting";
import { videolabRouter } from "./routers/videolab";
import { commandCenterRouter } from "./routers/commandCenter";
import { autoReportsRouter } from "./routers/autoReports";
import { radarRouter } from "./routers/radar";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  tiktok: tiktokRouter,
  bof: bofRouter,
  products: productsRouter,
  savedScripts: savedScriptsRouter,
  vetting: vettingRouter,
  videolab: videolabRouter,
  commandCenter: commandCenterRouter,
  autoReports: autoReportsRouter,
  radar: radarRouter,
});

export type AppRouter = typeof appRouter;
