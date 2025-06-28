import TicketSearch from './form/components/TicketSearch';
import { getTicketSearchResult } from '@/lib/queries/getTicketSearchResult';
import { getOpenTicket } from '@/lib/queries/getOpenTicket';
import TicketTable from './components/TicketsTable';

export const metadata = {
  title: 'Tickets',
};

type Props = {
  searchParams: Promise<{ [key: string]: string } | undefined>;
};

const TicketsPage = async ({ searchParams }: Props) => {
  const searchText = (await searchParams)?.searchText;

  if (!searchText) {
    const results = await getOpenTicket();
    return (
      <>
        <TicketSearch />
        {results.length > 0 ? (
          <TicketTable data={results} />
        ) : (
          <p className='mt-4'>No results fond</p>
        )}
      </>
    );
  }

  const results = await getTicketSearchResult(searchText!);

  return (
    <>
      <TicketSearch />
      {results.length > 0 ? (
        <TicketTable data={results} />
      ) : (
        <p className='mt-4'>No results fond</p>
      )}
    </>
  );
};

export default TicketsPage;
