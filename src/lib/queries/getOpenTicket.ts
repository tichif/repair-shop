import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { customers, tickets } from '@/db/schema';

export async function getOpenTicket() {
  const result = await db
    .select({
      createdAt: tickets.createdAt,
      title: tickets.title,
      customerId: tickets.customerId,
      firstName: customers.firstName,
      lastName: customers.lastName,
      email: customers.email,
      tech: tickets.tech,
    })
    .from(tickets)
    .leftJoin(customers, eq(tickets.customerId, customers.id))
    .where(eq(tickets.completed, false));

  return result;
}
