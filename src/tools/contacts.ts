import { z } from "zod";
import { apolloPost, apolloPut } from "../client.js";

export const searchContactsSchema = z.object({
  q_keywords: z.string().optional().describe("Search keywords"),
  contact_stage_ids: z.array(z.string()).optional().describe("Contact stage IDs"),
  sort_by_field: z.string().optional().describe("Field to sort by"),
  sort_ascending: z.boolean().optional().describe("Sort direction"),
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(25),
});

export async function searchContacts(args: z.infer<typeof searchContactsSchema>) {
  return apolloPost("/contacts/search", args);
}

export const createContactSchema = z.object({
  first_name: z.string().describe("First name"),
  last_name: z.string().describe("Last name"),
  email: z.string().optional().describe("Email address"),
  title: z.string().optional().describe("Job title"),
  organization_name: z.string().optional().describe("Company name"),
  phone: z.string().optional().describe("Phone number"),
  website_url: z.string().optional().describe("Website URL"),
  label_names: z.array(z.string()).optional().describe("Labels to apply"),
});

export async function createContact(args: z.infer<typeof createContactSchema>) {
  return apolloPost("/contacts", args);
}

export const updateContactSchema = z.object({
  contact_id: z.string().describe("Contact ID to update"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().optional(),
  title: z.string().optional(),
  organization_name: z.string().optional(),
  phone: z.string().optional(),
});

export async function updateContact(args: z.infer<typeof updateContactSchema>) {
  const { contact_id, ...body } = args;
  return apolloPut(`/contacts/${contact_id}`, body);
}
