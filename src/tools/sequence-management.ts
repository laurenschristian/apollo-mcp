import { z } from "zod";
import { apolloAppPost, apolloAppPut, apolloAppGet, apolloAppDelete, apolloV1Post, apolloV1Put, apolloV1Delete } from "../client.js";

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
  steps: z.array(emailStepSchema).optional().describe("Email steps to set on the sequence. By default APPENDS to existing steps. Set replace_steps=true to delete existing steps first."),
  replace_steps: z.boolean().optional().default(false).describe("If true, delete all existing steps before adding new ones. If false (default), append new steps."),
});

export async function updateSequence(args: z.infer<typeof updateSequenceSchema>) {
  const { sequence_id, steps, replace_steps, ...rest } = args;

  // Update campaign metadata (name, active) if provided
  if (Object.keys(rest).length > 0) {
    await apolloAppPut(`/emailer_campaigns/${sequence_id}`, rest);
  }

  // If replacing steps, delete all existing ones first
  if (steps && replace_steps) {
    const existing = await apolloAppGet(`/emailer_campaigns/${sequence_id}`) as { emailer_steps?: Array<{ id: string }> };
    if (existing.emailer_steps) {
      for (const step of existing.emailer_steps) {
        await apolloV1Delete(`/emailer_steps/${step.id}`);
      }
    }
  }

  // Add steps individually: create step via v1 API, then update template with content
  if (steps) {
    for (const step of steps) {
      const result = await apolloV1Post("/emailer_steps", {
        emailer_campaign_id: sequence_id,
        type: "auto_email",
        wait_time: step.wait_time,
        wait_mode: step.wait_mode,
        priority: "medium",
        position: step.position,
      }) as { emailer_touch?: { emailer_template_id?: string } };

      const templateId = result.emailer_touch?.emailer_template_id;
      if (templateId) {
        await apolloV1Put(`/emailer_templates/${templateId}`, {
          subject: step.subject,
          body_html: step.body_html,
        });
      }
    }
  }

  // Return the updated sequence
  return apolloAppGet(`/emailer_campaigns/${sequence_id}`);
}

// Delete a sequence step (undocumented but working endpoint)
export const deleteStepSchema = z.object({
  step_id: z.string().describe("Emailer step ID to delete"),
});

export async function deleteStep(args: z.infer<typeof deleteStepSchema>) {
  return apolloV1Delete(`/emailer_steps/${args.step_id}`);
}

// Archive a sequence (Apollo does not support true deletion via API)
export const deleteSequenceSchema = z.object({
  sequence_id: z.string().describe("Sequence ID to archive"),
});

export async function deleteSequence(args: z.infer<typeof deleteSequenceSchema>) {
  return apolloAppPut(`/emailer_campaigns/${args.sequence_id}`, { archived: true });
}

// Unarchive a sequence
export const unarchiveSequenceSchema = z.object({
  sequence_id: z.string().describe("Sequence ID to unarchive"),
});

export async function unarchiveSequence(args: z.infer<typeof unarchiveSequenceSchema>) {
  return apolloAppPut(`/emailer_campaigns/${args.sequence_id}`, { archived: false });
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

// Update an existing email template
export const updateEmailTemplateSchema = z.object({
  template_id: z.string().describe("Email template ID to update. Use get_sequence to find template IDs in emailer_templates array."),
  name: z.string().optional().describe("Template name"),
  subject: z.string().optional().describe("Email subject line"),
  body_html: z.string().optional().describe("Email body as HTML. Supports {{first_name}}, {{last_name}}, {{company}}, {{title}}, {{personalized_opener}} and other custom field variables."),
});

export async function updateEmailTemplate(args: z.infer<typeof updateEmailTemplateSchema>) {
  const { template_id, ...body } = args;
  return apolloV1Put(`/emailer_templates/${template_id}`, body);
}
