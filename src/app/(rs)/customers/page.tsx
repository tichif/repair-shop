import * as Sentry from '@sentry/nextjs';

import CustomerSearch from './form/components/CustomerSearch';
import { getCustomerSearchResult } from '@/lib/queries/getCustumerSearchResult';
import CustomersTable from './components/CustomersTable';

export const metadata = {
  title: 'Customers Search',
};

type Props = {
  searchParams: Promise<{ [key: string]: string } | undefined>;
};

const CustomersPage = async ({ searchParams }: Props) => {
  const searchText = (await searchParams)?.searchText;

  if (!searchText) {
    return <CustomerSearch />;
  }

  const span = Sentry.startInactiveSpan({
    name: 'getCustomerSearchResult-2',
  });

  const results = await getCustomerSearchResult(searchText);
  span.end();

  return (
    <>
      <CustomerSearch />
      {results.length > 0 ? (
        <CustomersTable data={results} />
      ) : (
        <p className='mt-4'>No results found</p>
      )}
    </>
  );
};

export default CustomersPage;
