import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, QueryCtx } from "./_generated/server";
import { auth } from "./auth";

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

export const toggle = mutation({
  args: { messageId: v.id("messages"), value: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) throw new Error("Unauthorized user!");

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("message not found");

    const memeber = await getMember(ctx, message.workspaceId, userId);

    if (!memeber) throw new Error("unauthorized member!");

    const existingMessageReactionFromUser = await ctx.db
      .query("reactions")
      .filter((r) =>
        r.and(
          r.eq(r.field("messageId"), args.messageId),
          r.eq(r.field("memberId"), memeber._id),
          r.eq(r.field("value"), args.value)
        )
      )
      .first();

    if (existingMessageReactionFromUser) {
      await ctx.db.delete(existingMessageReactionFromUser._id);
      return existingMessageReactionFromUser._id;
    } else {
      const newReaction = await ctx.db.insert("reactions", {
        value: args.value,
        memberId: memeber._id,
        messageId: message._id,
        workspaceId: message.workspaceId,
      });

      return newReaction;
    }
  },
});
