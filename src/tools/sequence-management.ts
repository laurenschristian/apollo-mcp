import { z } from "zod";
import { apolloAppPost, apolloAppPut, apolloAppGet, apolloAppDelete } from "../client.js";

// Create a new sequence
export const createSequenceSchema = z.object({
  name: z.string().describe("Name for the email sequence"),
});

export async function createSequence(args: z.infer<typeof createSequenceSchema>) {
  return apolloAppPost("/emailer_campaigns", {
    name: args.name,
    creation_type: "new",
  });
}

// Get full sequence details including steps
export const getSequenceSchema = z.object({
  sequence_id: z.string().describe("Sequence ID to retrieve"),
});

export async function getSequence(args: z.infer<typeof getSequenceSchema>) {
  return apolloAppGet(`/emailer_campaigns/${args.sequence_id}`);
}

// Update sequence with steps
const emailStepSchema = z.object({
  position: z.number().describe("Step order (1-based)"),
  wait_time: z.number().default(1).describe("Delay before this step"),
  wait_mode: z.enum(["day", "hour", "minute"]).default("day").describe("Delay unit"),
  subject: z.string().describe("Email subject line. Supports {{first_name}}, {{last_name}}, {{company}}, {{title}}"),
  body_html: z.string().describe("Email body as HTML. Supports {{first_name}}, {{last_name}}, {{company}}, {{title}}, {{email}}, {{city}}, {{state}}"),
});

export const updateSequenceSchema = z.object({
  sequence_id: z.string().describe("Sequence ID to update"),
  name: z.string().optional().describe("New name for the sequence"),
  active: z.boolean().optional().describe("Activate or pause the sequence"),
  steps: z.array(emailStepSchema).optional().describe("Email steps to set on the sequence"),
});

export async function updateSequence(args: z.infer<typeof updateSequenceSchema>) {
  const { sequence_id, steps, ...rest } = args;
  const body: Record<string, unknown> = { ...rest };

  if (steps) {
    body.emailer_steps = steps.map((step) => ({
      type: "auto_email",
      wait_time: step.wait_time,
      wait_mode: step.wait_mode,
      priority: "medium",
      position: step.position,
      emailer_touches: [
        {
          type: step.position === 1 ? "new_thread" : "reply_thread",
          status: "active",
          include_signature: true,
          template_type: "emailer_template",
          emailer_template: {
            subject: step.subject,
            body_html: step.body_html,
          },
        },
      ],
    }));
  }

  return apolloAppPut(`/emailer_campaigns/${sequence_id}`, body);
}

// Delete a sequence
export const deleteSequenceSchema = z.object({
  sequence_id: z.string().describe("Sequence ID to delete"),
});

export async function deleteSequence(args: z.infer<typeof deleteSequenceSchema>) {
  return apolloAppDelete(`/emailer_campaigns/${args.sequence_id}`);
}

// List email templates
export const listEmailTemplatesSchema = z.object({
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(25),
});

export async function listEmailTemplates(args: z.infer<typeof listEmailTemplatesSchema>) {
  return apolloAppPost("/emailer_templates/search", args);
}

// Create email template
export const createEmailTemplateSchema = z.object({
  name: z.string().describe("Template name"),
  subject: z.string().describe("Email subject line"),
  body_html: z.string().describe("Email body as HTML. Supports {{first_name}}, {{last_name}}, {{company}}, {{title}}"),
});

export async function createEmailTemplate(args: z.infer<typeof createEmailTemplateSchema>) {
  return apolloAppPost("/emailer_templates", args);
}
