# Apollo.io MCP Server

MCP server for the Apollo.io API. Search people, enrich contacts, manage deals, sequences, and more — all from Claude Code or any MCP client.

## Setup

Add to your `.mcp.json`:

```json
{
  "apollo": {
    "command": "npx",
    "args": ["apollo-io-mcp-server@latest"],
    "env": {
      "APOLLO_API_KEY": "${APOLLO_API_KEY}"
    }
  }
}
```

Set `APOLLO_API_KEY` in your environment.

## Tools (29)

### People & Enrichment
- `search_people` — Search Apollo's people database (no credits)
- `enrich_person` — Enrich by name/email/domain/LinkedIn (1 credit)
- `bulk_enrich_people` — Enrich up to 10 people at once

### Companies
- `search_companies` — Search companies/organizations
- `enrich_company` — Enrich by domain
- `bulk_enrich_companies` — Enrich up to 10 companies
- `org_job_postings` — Get job postings for an org

### Contacts (CRM)
- `search_contacts` — Search your contacts
- `create_contact` — Create a contact
- `update_contact` — Update a contact

### Accounts
- `search_accounts` — Search accounts
- `create_account` — Create an account
- `update_account` — Update an account
- `bulk_create_accounts` — Create multiple accounts

### Email Sequences
- `search_sequences` — Search email sequences
- `add_to_sequence` — Add contacts to a sequence
- `search_emails` — Search sequence emails

### Deals
- `list_deals` — List pipeline deals
- `get_deal` — Get deal details
- `create_deal` — Create a deal
- `update_deal` — Update a deal

### Tasks
- `search_tasks` — Search tasks
- `create_task` — Create a task
- `bulk_create_tasks` — Create multiple tasks

### Calls
- `search_calls` — Search call records
- `create_call` — Log a call
- `update_call` — Update a call record

### Intelligence
- `search_news` — Search news articles about companies

### Usage
- `api_usage` — Check API usage stats and rate limits

## Rate Limits

Apollo enforces ~100 requests per 5 minutes (plan-dependent). The server surfaces Apollo's error messages directly when limits are hit.

## License

MIT
