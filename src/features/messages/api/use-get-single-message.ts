import { usePaginatedQuery, useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const BATCH_SIZE = 3;

type useGetSingleMessageProps = {
  id: Id<"messages">;
};

export type GetMessagesReturnType =
  (typeof api.messages.get._returnType)["page"];

export const useGetSingleMessage = ({ id }: useGetSingleMessageProps) => {
  const data = useQuery(api.messages.getById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
