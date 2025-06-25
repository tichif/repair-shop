import { getCustomer } from '@/lib/queries/getCustomer';
import BackButton from '@/components/BackButton';
import { getTicket } from '@/lib/queries/getTicket';

type Props = {
  searchParams: Promise<{ [key: string]: string } | undefined>;
};

const TicketFormPage = async ({ searchParams }: Props) => {
  try {
    const customerId = (await searchParams)?.customerId;
    const ticketId = (await searchParams)?.ticketId;

    if (!customerId && !ticketId) {
      return (
        <>
          <h2 className='text-2xl mb-2'>
            Ticket ID or Customer ID is required to view the form
          </h2>
          <BackButton title='Go Back' variant='default' />
        </>
      );
    }

    // New Ticket Form
    if (customerId) {
      const customer = await getCustomer(parseInt(customerId));
      if (!customerId) {
        return (
          <>
            <h2 className='text-2xl mb-2'>
              Customer ID #{customerId} not found
            </h2>
            <BackButton title='Go Back' variant='default' />
          </>
        );
      }
      console.log('Customer data:', customer);
      // put details of the customer form here
    }

    if (customerId) {
      const customer = await getCustomer(parseInt(customerId));

      if (!customer) {
        return (
          <>
            <h2 className='text-2xl mb-2'>
              Customer ID #{customerId} not found
            </h2>
            <BackButton title='Go Back' variant='default' />
          </>
        );
      }

      if (!customer.active) {
        return (
          <>
            <h2 className='text-2xl mb-2'>
              Customer ID #{customerId} is not active
            </h2>
            <BackButton title='Go Back' variant='default' />
          </>
        );
      }

      // return ticket form
    }

    // edit ticket form
    if (ticketId) {
      const ticket = await getTicket(parseInt(ticketId));

      if (!ticket) {
        return (
          <>
            <h2 className='text-2xl mb-2'>Ticket ID #{ticketId} not found</h2>
            <BackButton title='Go Back' variant='default' />
          </>
        );
      }

      const customer = await getCustomer(ticket.customerId);

      // return ticket form
      console.log('Ticket data:', ticket);
      console.log('Customer data:', customer);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load data: ${error.message}`);
    }
  }

  return <div>TicketFormPage</div>;
};

export default TicketFormPage;
