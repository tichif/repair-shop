import { getCustomer } from '@/lib/queries/getCustomer';
import BackButton from '@/components/BackButton';

type Props = {
  searchParams: Promise<{ [key: string]: string } | undefined>;
};

export default async function CustomerFormPage({ searchParams }: Props) {
  try {
    const customerId = (await searchParams)?.id;

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
    } else {
      // new form customer
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load customer data: ${error.message}`);
    }
  }
}
