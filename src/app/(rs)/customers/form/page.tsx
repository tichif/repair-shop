import * as Sentry from '@sentry/nextjs';

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
      console.log('Customer data:', customer);
      // put details of the customer form here
      return <CustomerForm customer={customer} />;
    } else {
      // new form customer
      return <CustomerForm />;
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      throw new Error(`Failed to load customer data: ${error.message}`);
    }
  }
}
