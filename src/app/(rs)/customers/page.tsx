import CustomerSearch from './form/components/CustomerSearch';
import { getCustomerSearchResult } from '@/lib/queries/getCustumerSearchResult';

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

  const results = await getCustomerSearchResult(searchText);

  return (
    <>
      <CustomerSearch />
      {JSON.stringify(results, null, 2)}
    </>
  );
};

export default CustomersPage;
