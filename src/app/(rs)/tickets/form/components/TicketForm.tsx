'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  type createTicketSchemaType,
  type selectTicketSchemaType,
  createTicketSchema,
} from '@/zod-schemas/ticket';
import { type selectCustomerSchemaType } from '@/zod-schemas/customer';

type Props = {
  customer: selectCustomerSchemaType;
  ticket?: selectTicketSchemaType;
};

const TicketForm = ({ customer, ticket }: Props) => {
  const defaultValues: createTicketSchemaType = {
    id: ticket?.id ?? 'New',
    customerId: ticket?.customerId ?? customer.id,
    title: ticket?.title ?? '',
    description: ticket?.description ?? '',
    completed: ticket?.completed ?? false,
    tech: ticket?.tech ?? 'new-ticket@example.com',
  };

  const form = useForm<createTicketSchemaType>({
    mode: 'onBlur',
    resolver: zodResolver(createTicketSchema),
    defaultValues,
  });

  async function submitForm(data: createTicketSchemaType) {
    console.log('Form submitted with data:', data);
    // Here you would typically handle the form submission, e.g., send data to an API
  }

  return (
    <div className='flex flex-col gap-1 sm:px-8'>
      <div>
        <h2 className='text-2xl font-bold'>
          {ticket?.id ? 'Edit' : 'New'} Ticket{' '}
          {ticket?.id ? `# ${ticket?.id}` : 'Form'}
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitForm)}
            className='flex flex-col sm:flex-row gap-4 sm:gap-8'
          >
            <p>{JSON.stringify(form.getValues())}</p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TicketForm;
