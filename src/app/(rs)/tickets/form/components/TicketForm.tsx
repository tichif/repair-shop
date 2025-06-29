'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { InputWithLabel } from '@/components/inputs/InputWithLabel';
import { TextAreaWithLabel } from '@/components/inputs/TextAreaWithLabel';
import { SelectWithLabel } from '@/components/inputs/SelectWithLabel';
import { CheckBoxWithLabel } from '@/components/inputs/CheckBoxWithLabel';
import {
  type createTicketSchemaType,
  type selectTicketSchemaType,
  createTicketSchema,
} from '@/zod-schemas/ticket';
import { type selectCustomerSchemaType } from '@/zod-schemas/customer';
import { saveTicketAction } from '@/app/actions/saveTicketAction';
import DisplayServerActionResponse from '@/components/DisplayServerActionResponse';

type Props = {
  customer: selectCustomerSchemaType;
  ticket?: selectTicketSchemaType;
  techs?: {
    id: string;
    description: string;
  }[];
  isEditable?: boolean;
  isManager?: boolean;
};

const TicketForm = ({
  customer,
  ticket,
  techs,
  isEditable = true,
  isManager = false,
}: Props) => {
  const defaultValues: createTicketSchemaType = {
    id: ticket?.id ?? 'New',
    customerId: ticket?.customerId ?? customer.id,
    title: ticket?.title ?? '',
    description: ticket?.description ?? '',
    completed: ticket?.completed ?? false,
    tech: ticket?.tech.toLowerCase() ?? 'new-ticket@example.com',
  };

  const form = useForm<createTicketSchemaType>({
    mode: 'onBlur',
    resolver: zodResolver(createTicketSchema),
    defaultValues,
  });

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
    reset: resetAction,
  } = useAction(saveTicketAction, {
    onSuccess({ data }) {
      if (data.message) {
        toast('Success', {
          description: data.message,
        });
      }
    },
    onError({ error }) {
      toast.error('Error', {
        description: 'Saved failed',
      });
    },
  });

  async function submitForm(data: createTicketSchemaType) {
    executeSave(data);
  }

  return (
    <div className='flex flex-col gap-1 sm:px-8'>
      <DisplayServerActionResponse result={saveResult} />
      <div>
        <h2 className='text-2xl font-bold'>
          {ticket?.id ? 'Edit' : 'New'} Ticket{' '}
          {ticket?.id ? `# ${ticket?.id}` : 'Form'}
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitForm)}
            className='flex flex-col md:flex-row gap-4 md:gap-8'
          >
            <div className='flex flex-col gap-4 w-full max-w-xs'>
              <InputWithLabel<createTicketSchemaType>
                fieldTitle='Title'
                nameInSchema='title'
                disabled={!isEditable}
              />
              {isManager && techs ? (
                <SelectWithLabel<createTicketSchemaType>
                  fieldTitle='Tech ID'
                  nameInSchema='tech'
                  data={[
                    {
                      id: 'new-ticket@example.com',
                      description: 'new-ticket@example.com',
                    },
                    ...techs,
                  ]}
                />
              ) : (
                <InputWithLabel<createTicketSchemaType>
                  fieldTitle='Tech'
                  nameInSchema='tech'
                  disabled={true}
                />
              )}

              {ticket?.id && (
                <CheckBoxWithLabel<createTicketSchemaType>
                  fieldTitle='Completed'
                  nameInSchema='completed'
                  message='Yes'
                  disabled={!isEditable}
                />
              )}
              <div className='mt-4 space-y-2'>
                <h3 className='text-lg'> Customer Info</h3>
                <hr className='w-4/5' />
                <p>
                  {customer.firstName} {customer.lastName}
                </p>
                <p>{customer.address1}</p>
                {customer.address2 && <p>{customer.address2}</p>}
                <p>
                  {customer.city}, {customer.state} {customer.zip}
                </p>
                <hr className='w-4-5' />
                <p>{customer.email}</p>
                <p>Phone: {customer.phone}</p>
              </div>
            </div>
            <div className='flex flex-col gap-4 w-full max-w-xs'>
              <TextAreaWithLabel<createTicketSchemaType>
                fieldTitle='Description'
                nameInSchema='description'
                className='h-96'
                disabled={!isEditable}
              />
              {isEditable && (
                <div className='flex gap-2'>
                  <Button
                    type='submit'
                    className='w-3/4'
                    variant='default'
                    title='Save'
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <LoaderCircle className='animate-spin' />
                    ) : (
                      'Save'
                    )}
                  </Button>
                  <Button
                    type='button'
                    variant='destructive'
                    title='Reset'
                    onClick={() => {
                      form.reset(defaultValues);
                      resetAction();
                    }}
                    disabled={isSaving}
                  >
                    Reset
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TicketForm;
