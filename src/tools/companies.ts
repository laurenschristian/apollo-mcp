import { z } from "zod";
import { apolloPost, apolloGet } from "../client.js";

export const searchCompaniesSchema = z.object({
  q_keywords: z.string().optional().describe("Search keywords"),
  organization_locations: z.array(z.string()).optional().describe("HQ locations"),
  organization_num_employees_ranges: z.array(z.string()).optional().describe("Employee ranges (e.g. '1,10', '11,50', '51,200')"),
  organization_industry_tag_ids: z.array(z.string()).optional().describe("Industry tag IDs"),
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(25),
});

export async function searchCompanies(args: z.infer<typeof searchCompaniesSchema>) {
  return apolloPost("/mixed_companies/search", args);
}

export const enrichCompanySchema = z.object({
  domain: z.string().describe("Company domain to enrich"),
});

export async function enrichCompany(args: z.infer<typeof enrichCompanySchema>) {
  return apolloGet("/organizations/enrich", { domain: args.domain });
}

export const bulkEnrichCompaniesSchema = z.object({
  domains: z.array(z.string()).max(10).describe("Company domains to enrich (max 10)"),
});

export async function bulkEnrichCompanies(args: z.infer<typeof bulkEnrichCompaniesSchema>) {
  return apolloPost("/organizations/bulk_match", { domains: args.domains });
}

export const orgJobPostingsSchema = z.object({
  organization_id: z.string().describe("Apollo organization ID"),
});

export async function orgJobPostings(args: z.infer<typeof orgJobPostingsSchema>) {
  return apolloGet(`/organizations/${args.organization_id}/job_postings`);
}
