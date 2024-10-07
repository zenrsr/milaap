import { mutation } from "./_generated/server";

export const generateUplaodUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
