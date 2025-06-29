import * as Sentry from '@sentry/nextjs';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Users, init as KindeInt } from '@kinde/management-api-js';

import { getCustomer } from '@/lib/queries/getCustomer';
import BackButton from '@/components/BackButton';
import { getTicket } from '@/lib/queries/getTicket';
import TicketForm from './components/TicketForm';

type Props = {
  searchParams: Promise<{ [key: string]: string } | undefined>;
};

export async function generateMetadata({ searchParams }: Props) {
  const ticketId = (await searchParams)?.ticketId;
  const customerId = (await searchParams)?.customerId;

  if (!customerId && !ticketId) {
    return {
      title: 'Missing Ticket or Customer ID',
      description:
        'Please provide a Ticket ID or Customer ID to view the form.',
    };
  }

  if (customerId) {
    return {
      title: `New Ticket for Customer ID #${customerId}`,
      description: `Create a new ticket for Customer ID #${customerId}.`,
    };
  }

  if (ticketId) {
    return {
      title: `Edit Ticket ID #${ticketId}`,
      description: `Edit details for Ticket ID #${ticketId}.`,
    };
  }
}

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

    const { getPermission, getUser } = getKindeServerSession();
    const [managerPermission, user] = await Promise.all([
      getPermission('manager'),
      getUser(),
    ]);
    const isManager = managerPermission?.isGranted;

    // New Ticket Form
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
      if (isManager) {
        KindeInt(); //initialize Kinde Management API
        const { users } = await Users.getUsers();

        const techs = users
          ? users.map((user) => ({
              id: user.email?.toLowerCase()!,
              description: user.email?.toLowerCase()!,
            }))
          : [];
        return (
          <TicketForm customer={customer} techs={techs} isManager={isManager} />
        );
      } else {
        return <TicketForm customer={customer} />;
      }
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

      if (isManager) {
        KindeInt(); //initialize Kinde Management API
        const { users } = await Users.getUsers();

        const techs = users
          ? users.map((user) => ({ id: user.email!, description: user.email! }))
          : [];
        return (
          <TicketForm
            customer={customer}
            ticket={ticket}
            techs={techs}
            isManager={isManager}
          />
        );
      } else {
        const isEditable = user?.email === ticket.tech;
        return (
          <TicketForm
            customer={customer}
            ticket={ticket}
            isEditable={isEditable}
          />
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      throw new Error(`Failed to load data: ${error.message}`);
    }
  }

  return <div>TicketFormPage</div>;
};

export default TicketFormPage;
