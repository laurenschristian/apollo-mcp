import { z } from "zod";
import { apolloPost } from "../client.js";

export const apiUsageSchema = z.object({});

export async function apiUsage() {
  return apolloPost("/usage_stats/api_usage_stats", {});
}
