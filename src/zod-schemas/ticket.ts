import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { tickets } from '@/db/schema';

export const createTicketSchema = createInsertSchema(tickets, {
  id: z.union([z.number(), z.literal('New')]),
  title: (schema) => schema.title.min(1, 'Title is required'),
  description: (schema) => schema.description.min(1, 'Description is required'),
  tech: (schema) => schema.tech.email('Invalid email address'),
});

export const selectTicketSchema = createSelectSchema(tickets);

export type createTicketSchemaType = typeof createTicketSchema._type;
export type selectTicketSchemaType = typeof selectTicketSchema._type;
