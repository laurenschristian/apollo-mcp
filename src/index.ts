#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { searchPeopleSchema, searchPeople, enrichPersonSchema, enrichPerson, bulkEnrichPeopleSchema, bulkEnrichPeople } from "./tools/people.js";
import { searchCompaniesSchema, searchCompanies, enrichCompanySchema, enrichCompany, bulkEnrichCompaniesSchema, bulkEnrichCompanies, orgJobPostingsSchema, orgJobPostings } from "./tools/companies.js";
import { searchContactsSchema, searchContacts, createContactSchema, createContact, updateContactSchema, updateContact } from "./tools/contacts.js";
import { searchAccountsSchema, searchAccounts, createAccountSchema, createAccount, updateAccountSchema, updateAccount, bulkCreateAccountsSchema, bulkCreateAccounts } from "./tools/accounts.js";
import { searchSequencesSchema, searchSequences, addToSequenceSchema, addToSequence, searchEmailsSchema, searchEmails } from "./tools/sequences.js";
import { listDealsSchema, listDeals, getDealSchema, getDeal, createDealSchema, createDeal, updateDealSchema, updateDeal } from "./tools/deals.js";
import { searchTasksSchema, searchTasks, createTaskSchema, createTask, bulkCreateTasksSchema, bulkCreateTasks } from "./tools/tasks.js";
import { searchCallsSchema, searchCalls, createCallSchema, createCall, updateCallSchema, updateCall } from "./tools/calls.js";
import { searchNewsSchema, searchNews } from "./tools/news.js";
import { apiUsageSchema, apiUsage } from "./tools/usage.js";

const server = new McpServer({
  name: "apollo-io",
  version: "1.0.0",
});

// People & Enrichment
server.tool("search_people", "Search for people in Apollo's database. Use for prospecting and lead discovery. No credits consumed.", searchPeopleSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await searchPeople(searchPeopleSchema.parse(args)), null, 2) }],
}));

server.tool("enrich_person", "Enrich a person by name, email, domain, or LinkedIn URL. Costs 1 credit.", enrichPersonSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await enrichPerson(enrichPersonSchema.parse(args)), null, 2) }],
}));

server.tool("bulk_enrich_people", "Enrich up to 10 people at once. Each costs 1 credit.", bulkEnrichPeopleSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await bulkEnrichPeople(bulkEnrichPeopleSchema.parse(args)), null, 2) }],
}));

// Companies
server.tool("search_companies", "Search for companies/organizations in Apollo's database.", searchCompaniesSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await searchCompanies(searchCompaniesSchema.parse(args)), null, 2) }],
}));

server.tool("enrich_company", "Enrich a company by domain. Returns firmographic data.", enrichCompanySchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await enrichCompany(enrichCompanySchema.parse(args)), null, 2) }],
}));

server.tool("bulk_enrich_companies", "Enrich up to 10 companies by domain at once.", bulkEnrichCompaniesSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await bulkEnrichCompanies(bulkEnrichCompaniesSchema.parse(args)), null, 2) }],
}));

server.tool("org_job_postings", "Get job postings for an organization.", orgJobPostingsSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await orgJobPostings(orgJobPostingsSchema.parse(args)), null, 2) }],
}));

// Contacts (CRM)
server.tool("search_contacts", "Search your Apollo contacts (CRM records you own).", searchContactsSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await searchContacts(searchContactsSchema.parse(args)), null, 2) }],
}));

server.tool("create_contact", "Create a new contact in your Apollo CRM.", createContactSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await createContact(createContactSchema.parse(args)), null, 2) }],
}));

server.tool("update_contact", "Update an existing contact in your Apollo CRM.", updateContactSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await updateContact(updateContactSchema.parse(args)), null, 2) }],
}));

// Accounts
server.tool("search_accounts", "Search your Apollo accounts.", searchAccountsSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await searchAccounts(searchAccountsSchema.parse(args)), null, 2) }],
}));

server.tool("create_account", "Create a new account in Apollo.", createAccountSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await createAccount(createAccountSchema.parse(args)), null, 2) }],
}));

server.tool("update_account", "Update an existing Apollo account.", updateAccountSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await updateAccount(updateAccountSchema.parse(args)), null, 2) }],
}));

server.tool("bulk_create_accounts", "Create multiple accounts at once.", bulkCreateAccountsSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await bulkCreateAccounts(bulkCreateAccountsSchema.parse(args)), null, 2) }],
}));

// Sequences
server.tool("search_sequences", "Search email sequences (emailer campaigns).", searchSequencesSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await searchSequences(searchSequencesSchema.parse(args)), null, 2) }],
}));

server.tool("add_to_sequence", "Add contacts to an email sequence.", addToSequenceSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await addToSequence(addToSequenceSchema.parse(args)), null, 2) }],
}));

server.tool("search_emails", "Search emails sent from sequences.", searchEmailsSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await searchEmails(searchEmailsSchema.parse(args)), null, 2) }],
}));

// Deals
server.tool("list_deals", "List deals in your Apollo pipeline.", listDealsSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await listDeals(listDealsSchema.parse(args)), null, 2) }],
}));

server.tool("get_deal", "Get details of a specific deal.", getDealSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await getDeal(getDealSchema.parse(args)), null, 2) }],
}));

server.tool("create_deal", "Create a new deal in your pipeline.", createDealSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await createDeal(createDealSchema.parse(args)), null, 2) }],
}));

server.tool("update_deal", "Update an existing deal.", updateDealSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await updateDeal(updateDealSchema.parse(args)), null, 2) }],
}));

// Tasks
server.tool("search_tasks", "Search tasks in Apollo.", searchTasksSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await searchTasks(searchTasksSchema.parse(args)), null, 2) }],
}));

server.tool("create_task", "Create a new task.", createTaskSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await createTask(createTaskSchema.parse(args)), null, 2) }],
}));

server.tool("bulk_create_tasks", "Create multiple tasks at once.", bulkCreateTasksSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await bulkCreateTasks(bulkCreateTasksSchema.parse(args)), null, 2) }],
}));

// Calls
server.tool("search_calls", "Search phone call records.", searchCallsSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await searchCalls(searchCallsSchema.parse(args)), null, 2) }],
}));

server.tool("create_call", "Log a phone call.", createCallSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await createCall(createCallSchema.parse(args)), null, 2) }],
}));

server.tool("update_call", "Update a phone call record.", updateCallSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await updateCall(updateCallSchema.parse(args)), null, 2) }],
}));

// News
server.tool("search_news", "Search news articles about companies.", searchNewsSchema.shape, async (args) => ({
  content: [{ type: "text", text: JSON.stringify(await searchNews(searchNewsSchema.parse(args)), null, 2) }],
}));

// Usage
server.tool("api_usage", "Check your Apollo API usage stats and rate limits.", apiUsageSchema.shape, async () => ({
  content: [{ type: "text", text: JSON.stringify(await apiUsage(), null, 2) }],
}));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
