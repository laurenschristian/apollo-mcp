import { z } from "zod";
import { apolloPost } from "../client.js";

export const searchSequencesSchema = z.object({
  q_keywords: z.string().optional().describe("Search keywords"),
  sort_by_field: z.string().optional(),
  sort_ascending: z.boolean().optional(),
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(25),
});

export async function searchSequences(args: z.infer<typeof searchSequencesSchema>) {
  return apolloPost("/emailer_campaigns/search", args);
}

export const addToSequenceSchema = z.object({
  sequence_id: z.string().describe("Sequence (emailer campaign) ID"),
  contact_ids: z.array(z.string()).describe("Contact IDs to add"),
  emailer_campaign_id: z.string().optional().describe("Alias for sequence_id (deprecated, use sequence_id)"),
});

export async function addToSequence(args: z.infer<typeof addToSequenceSchema>) {
  const { sequence_id, contact_ids } = args;
  return apolloPost(`/emailer_campaigns/${sequence_id}/add_contact_ids`, { contact_ids });
}

export const searchEmailsSchema = z.object({
  emailer_campaign_id: z.string().optional().describe("Filter by sequence ID"),
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(25),
});

export async function searchEmails(args: z.infer<typeof searchEmailsSchema>) {
  return apolloPost("/emailer_campaigns/emails/search", args);
}
