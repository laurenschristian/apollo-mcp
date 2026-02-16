import { z } from "zod";
import { apolloPost, apolloPut } from "../client.js";

export const searchCallsSchema = z.object({
  q_keywords: z.string().optional().describe("Search keywords"),
  sort_by_field: z.string().optional(),
  sort_ascending: z.boolean().optional(),
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(25),
});

export async function searchCalls(args: z.infer<typeof searchCallsSchema>) {
  return apolloPost("/phone_calls/search", args);
}

export const createCallSchema = z.object({
  contact_id: z.string().describe("Contact ID for the call"),
  note: z.string().optional().describe("Call notes"),
  disposition: z.string().optional().describe("Call disposition"),
  duration: z.number().optional().describe("Call duration in seconds"),
});

export async function createCall(args: z.infer<typeof createCallSchema>) {
  return apolloPost("/phone_calls", args);
}

export const updateCallSchema = z.object({
  call_id: z.string().describe("Call ID to update"),
  note: z.string().optional(),
  disposition: z.string().optional(),
});

export async function updateCall(args: z.infer<typeof updateCallSchema>) {
  const { call_id, ...body } = args;
  return apolloPut(`/phone_calls/${call_id}`, body);
}
