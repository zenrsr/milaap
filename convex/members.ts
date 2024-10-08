import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

const populateuser = (ctx: QueryCtx, id: Id<"users">) => {
  return ctx.db.get(id);
};

export const current = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member) return null;
    return member;
  },
});

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member) return [];

    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    const members = [];

    for (const member of data) {
      const user = await populateuser(ctx, member.userId);
      if (user) {
        members.push({ ...member, user });
      }
    }

    return members;
  },
});

export const getById = query({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const member = await ctx.db.get(args.id);
    if (!member) return null;

    const currentMemeber = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!currentMemeber) return null;

    const user = await populateuser(ctx, member.userId);
    if (!user) return null;

    return {
      ...member,
      user,
    };
  },
});

export const update = mutation({
  args: {
    id: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("unauthorized");

    const member = await ctx.db.get(args.id);
    if (!member) throw new Error("unauthorized, no member found here!");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!currentMember || currentMember.role !== "admin")
      throw new Error(
        "You don't have sufficient authority to update the database of this user"
      );

    await ctx.db.patch(args.id, { role: args.role });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("unauthorized");

    const member = await ctx.db.get(args.id);
    if (!member) throw new Error("unauthorized, no member found here!");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!currentMember)
      throw new Error(
        "You don't have sufficient authority to update the database of this user"
      );

    if (member.role === "admin") throw new Error("Admin cannot be removed");

    if (currentMember._id === args.id && currentMember.role === "admin")
      throw new Error(
        "Error! You cannot remove yourself cuz, you are the Admin !"
      );

    const [messages, reactions, conversations] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("reactions")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("conversations")
        .filter((m) =>
          m.or(
            m.eq(m.field("memberOneId"), member._id),
            m.eq(m.field("memberTwoId"), member._id)
          )
        )
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }

    for (const convo of conversations) {
      await ctx.db.delete(convo._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
