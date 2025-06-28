import { eq, asc } from 'drizzle-orm';

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
      id: tickets.id,
      completed: tickets.completed,
    })
    .from(tickets)
    .leftJoin(customers, eq(tickets.customerId, customers.id))
    .where(eq(tickets.completed, false))
    .orderBy(asc(tickets.createdAt));

  return result;
}
