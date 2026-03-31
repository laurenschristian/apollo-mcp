import { z } from "zod";
import { apolloPost, apolloPut, apolloPatch, apolloGet } from "../client.js";

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
  account_id: z.string().optional().describe("Apollo account ID to link to"),
  phone: z.string().optional().describe("Phone number"),
  website_url: z.string().optional().describe("Website URL"),
  label_names: z.array(z.string()).optional().describe("Labels to apply"),
  present_raw_address: z.string().optional().describe("Location (city, state, country)"),
  typed_custom_fields: z.record(z.string()).optional().describe("Custom field values. Keys are field IDs, values are the field content. Use list_custom_fields to get field IDs."),
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
  account_id: z.string().optional().describe("Apollo account ID to link to"),
  phone: z.string().optional(),
  present_raw_address: z.string().optional().describe("Location (city, state, country)"),
  label_names: z.array(z.string()).optional().describe("Labels to apply (replaces existing)"),
  typed_custom_fields: z.record(z.string()).optional().describe("Custom field values. Keys are field IDs, values are the field content. Use list_custom_fields to get field IDs."),
});

export async function updateContact(args: z.infer<typeof updateContactSchema>) {
  const { contact_id, ...body } = args;
  return apolloPatch(`/contacts/${contact_id}`, body);
}

export const listCustomFieldsSchema = z.object({
  modality: z.enum(["contact", "account", "opportunity"]).optional().default("contact").describe("Field type: contact, account, or opportunity"),
});

export async function listCustomFields(args: z.infer<typeof listCustomFieldsSchema>) {
  return apolloGet("/fields", { source: "custom" });
}

export const createCustomFieldSchema = z.object({
  label: z.string().describe("Name of the custom field (e.g. 'Personalized Opener')"),
  modality: z.enum(["contact", "account", "opportunity"]).describe("What object type: contact, account, or opportunity"),
  type: z.enum(["string", "textarea", "number", "date", "datetime", "boolean"]).describe("Field data type. Use 'textarea' for multi-line text like personalized openers."),
});

export async function createCustomField(args: z.infer<typeof createCustomFieldSchema>) {
  return apolloPost("/fields", args);
}
