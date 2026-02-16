import { z } from "zod";
import { apolloPost } from "../client.js";

export const searchPeopleSchema = z.object({
  q_keywords: z.string().optional().describe("Search keywords"),
  person_titles: z.array(z.string()).optional().describe("Job titles to filter by"),
  person_seniorities: z.array(z.string()).optional().describe("Seniority levels (e.g. senior, manager, director, vp, c_suite)"),
  person_locations: z.array(z.string()).optional().describe("Locations (e.g. 'United States', 'San Francisco, CA')"),
  organization_ids: z.array(z.string()).optional().describe("Apollo organization IDs to search within"),
  organization_domains: z.array(z.string()).optional().describe("Company domains to search within"),
  page: z.number().optional().default(1).describe("Page number"),
  per_page: z.number().optional().default(25).describe("Results per page (max 100)"),
});

export async function searchPeople(args: z.infer<typeof searchPeopleSchema>) {
  return apolloPost("/mixed_people/api_search", args);
}

export const enrichPersonSchema = z.object({
  first_name: z.string().optional().describe("Person's first name"),
  last_name: z.string().optional().describe("Person's last name"),
  email: z.string().optional().describe("Person's email address"),
  domain: z.string().optional().describe("Company domain"),
  organization_name: z.string().optional().describe("Company name"),
  linkedin_url: z.string().optional().describe("LinkedIn profile URL"),
});

export async function enrichPerson(args: z.infer<typeof enrichPersonSchema>) {
  return apolloPost("/people/match", args);
}

export const bulkEnrichPeopleSchema = z.object({
  details: z.array(z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
    domain: z.string().optional(),
    organization_name: z.string().optional(),
    linkedin_url: z.string().optional(),
  })).max(10).describe("Array of people to enrich (max 10)"),
});

export async function bulkEnrichPeople(args: z.infer<typeof bulkEnrichPeopleSchema>) {
  return apolloPost("/people/bulk_match", args);
}
