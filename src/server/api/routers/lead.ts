import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const leadRouter = createTRPCRouter({
  createLead: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.lead.create({
        data: {
          email: input.email,
        },
      });
    }),
});
