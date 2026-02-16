const BASE_URL = "https://api.apollo.io/api/v1";

function getApiKey(): string {
  const key = process.env.APOLLO_API_KEY;
  if (!key) {
    throw new Error("APOLLO_API_KEY environment variable is required");
  }
  return key;
}

// Fields that bloat LLM context without adding value
const STRIP_FIELDS = [
  "photo_url",
  "twitter_url",
  "github_url",
  "facebook_url",
  "linkedin_url",
  "logo_url",
  "raw_address",
  "sanitized_phone",
  "organization_id",
  "account_id",
  "contact_campaign_statuses",
  "existence_level",
  "extrapolated_email_confidence",
  "email_domain_catchall",
];

function stripBloat(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(stripBloat);
  if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (STRIP_FIELDS.includes(key)) continue;
      result[key] = stripBloat(value);
    }
    return result;
  }
  return obj;
}

export async function apolloGet(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<unknown> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  url.searchParams.set("api_key", getApiKey());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Apollo API error (${response.status}): ${body}`);
  }

  const data = await response.json();
  return stripBloat(data);
}

export async function apolloPost(
  path: string,
  body: Record<string, unknown> = {}
): Promise<unknown> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": getApiKey(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Apollo API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  return stripBloat(data);
}

export async function apolloPut(
  path: string,
  body: Record<string, unknown> = {}
): Promise<unknown> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": getApiKey(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Apollo API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  return stripBloat(data);
}
