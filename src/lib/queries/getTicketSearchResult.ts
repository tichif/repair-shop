import { eq, ilike, or, sql, asc } from 'drizzle-orm';

import { db } from '@/db';
import { customers, tickets } from '@/db/schema';

export async function getTicketSearchResult(searchText: string) {
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
    .where(
      or(
        ilike(tickets.title, `%${searchText}%`),
        ilike(tickets.tech, `%${searchText}%`),
        ilike(customers.email, `%${searchText}%`),
        ilike(customers.phone, `%${searchText}%`),
        ilike(customers.city, `%${searchText}%`),
        ilike(customers.zip, `%${searchText}%`),
        sql`lower(concat(${customers.firstName}, ' ', ${
          customers.lastName
        })) LIKE (${`%${searchText.toLowerCase().replace(' ', '%')}%`})`
      )
    )
    .orderBy(asc(tickets.createdAt));

  return result;
}

export type TicketSearchResultType = Awaited<
  ReturnType<typeof getTicketSearchResult>
>;
