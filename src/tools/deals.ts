import { z } from "zod";
import { apolloGet, apolloPost, apolloPut } from "../client.js";

export const listDealsSchema = z.object({
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(25),
});

export async function listDeals(args: z.infer<typeof listDealsSchema>) {
  return apolloGet("/deals", { page: args.page, per_page: args.per_page });
}

export const getDealSchema = z.object({
  deal_id: z.string().describe("Deal ID"),
});

export async function getDeal(args: z.infer<typeof getDealSchema>) {
  return apolloGet(`/deals/${args.deal_id}`);
}

export const createDealSchema = z.object({
  name: z.string().describe("Deal name"),
  amount: z.number().optional().describe("Deal amount"),
  deal_stage_id: z.string().optional().describe("Deal stage ID"),
  account_id: z.string().optional().describe("Associated account ID"),
  contact_ids: z.array(z.string()).optional().describe("Associated contact IDs"),
  owner_id: z.string().optional().describe("Owner user ID"),
});

export async function createDeal(args: z.infer<typeof createDealSchema>) {
  return apolloPost("/deals", args);
}

export const updateDealSchema = z.object({
  deal_id: z.string().describe("Deal ID to update"),
  name: z.string().optional(),
  amount: z.number().optional(),
  deal_stage_id: z.string().optional(),
});

export async function updateDeal(args: z.infer<typeof updateDealSchema>) {
  const { deal_id, ...body } = args;
  return apolloPut(`/deals/${deal_id}`, body);
}
