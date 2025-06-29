import * as Sentry from '@sentry/nextjs';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import { getCustomer } from '@/lib/queries/getCustomer';
import BackButton from '@/components/BackButton';
import CustomerForm from './components/CustomerForm';

type Props = {
  searchParams: Promise<{ [key: string]: string } | undefined>;
};

export async function generateMetadata({ searchParams }: Props) {
  const customerId = (await searchParams)?.customerId;

  if (!customerId) {
    return {
      title: 'New Customer',
      description: 'Create a new customer in the system',
    };
  }
  return {
    title: `Customer ID #${customerId}`,
    description: `Edit details for customer ID #${customerId}`,
  };
}

export default async function CustomerFormPage({ searchParams }: Props) {
  try {
    const { getPermission } = getKindeServerSession();
    const managerPermission = await getPermission('manager');
    const isManager = managerPermission?.isGranted;

    const customerId = (await searchParams)?.customerId;

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

      // put details of the customer form here
      return (
        <CustomerForm
          key={customerId}
          customer={customer}
          isManager={isManager}
        />
      );
    } else {
      // new form customer
      return <CustomerForm key='new' isManager={isManager} />;
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      throw new Error(`Failed to load customer data: ${error.message}`);
    }
  }
}
