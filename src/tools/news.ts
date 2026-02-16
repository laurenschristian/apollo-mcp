import { z } from "zod";
import { apolloPost } from "../client.js";

export const searchNewsSchema = z.object({
  q_keywords: z.string().optional().describe("Search keywords"),
  organization_ids: z.array(z.string()).optional().describe("Filter by organization IDs"),
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(25),
});

export async function searchNews(args: z.infer<typeof searchNewsSchema>) {
  return apolloPost("/news_articles/search", args);
}
