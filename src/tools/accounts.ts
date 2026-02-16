import { z } from "zod";
import { apolloPost, apolloPut } from "../client.js";

export const searchAccountsSchema = z.object({
  q_keywords: z.string().optional().describe("Search keywords"),
  sort_by_field: z.string().optional().describe("Field to sort by"),
  sort_ascending: z.boolean().optional(),
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(25),
});

export async function searchAccounts(args: z.infer<typeof searchAccountsSchema>) {
  return apolloPost("/accounts/search", args);
}

export const createAccountSchema = z.object({
  name: z.string().describe("Account name"),
  domain: z.string().optional().describe("Company domain"),
  phone: z.string().optional(),
  website_url: z.string().optional(),
});

export async function createAccount(args: z.infer<typeof createAccountSchema>) {
  return apolloPost("/accounts", args);
}

export const updateAccountSchema = z.object({
  account_id: z.string().describe("Account ID to update"),
  name: z.string().optional(),
  domain: z.string().optional(),
  phone: z.string().optional(),
  website_url: z.string().optional(),
});

export async function updateAccount(args: z.infer<typeof updateAccountSchema>) {
  const { account_id, ...body } = args;
  return apolloPut(`/accounts/${account_id}`, body);
}

export const bulkCreateAccountsSchema = z.object({
  accounts: z.array(z.object({
    name: z.string(),
    domain: z.string().optional(),
    phone: z.string().optional(),
    website_url: z.string().optional(),
  })).describe("Array of accounts to create"),
});

export async function bulkCreateAccounts(args: z.infer<typeof bulkCreateAccountsSchema>) {
  return apolloPost("/accounts/bulk_create", { accounts: args.accounts });
}
