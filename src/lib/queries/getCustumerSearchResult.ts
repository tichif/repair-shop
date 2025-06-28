import { ilike, or, sql } from 'drizzle-orm';

import { db } from '@/db';
import { customers } from '@/db/schema';

export async function getCustomerSearchResult(searchText: string) {
  const result = await db
    .select()
    .from(customers)
    .where(
      or(
        ilike(customers.email, `%${searchText}%`),
        ilike(customers.phone, `%${searchText}%`),
        ilike(customers.city, `%${searchText}%`),
        ilike(customers.zip, `%${searchText}%`),
        sql`lower(concat(${customers.firstName}, ' ', ${
          customers.lastName
        })) LIKE (${`%${searchText.toLowerCase().replace(' ', '%')}%`})`
      )
    );

  return result;
}
