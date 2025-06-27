import TicketSearch from './form/components/TicketSearch';
import { getTicketSearchResult } from '@/lib/queries/getTicketSearchResult';
import { getOpenTicket } from '@/lib/queries/getOpenTicket';

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
        <p>{JSON.stringify(results)}</p>
      </>
    );
  }

  const results = await getTicketSearchResult(searchText!);

  return (
    <>
      <TicketSearch />
      <p>{JSON.stringify(results)}</p>
      {/* query search result */}
    </>
  );
};

export default TicketsPage;
