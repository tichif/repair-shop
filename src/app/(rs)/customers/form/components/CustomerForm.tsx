'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
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
  insertCustomerSchema,
  type insertCustomerSchemaType,
  type selectCustomerSchemaType,
} from '@/zod-schemas/customer';
import { StatesArray } from '@/constants/StateArray';
import { saveCustomerAction } from '@/app/actions/saveCustomerAction';
import DisplayServerActionResponse from '@/components/DisplayServerActionResponse';

type Props = {
  customer?: selectCustomerSchemaType;
};

const CustomerForm = ({ customer }: Props) => {
  const { getPermission, isLoading } = useKindeBrowserClient();
  const isManager = !isLoading && getPermission('manager')?.isGranted;

  const defaultValues: insertCustomerSchemaType = {
    id: customer?.id ?? 0,
    firstName: customer?.firstName ?? '',
    lastName: customer?.lastName ?? '',
    address1: customer?.address1 ?? '',
    address2: customer?.address2 ?? '',
    city: customer?.city ?? '',
    state: customer?.state ?? '',
    zip: customer?.zip ?? '',
    phone: customer?.phone ?? '',
    email: customer?.email ?? '',
    notes: customer?.notes ?? '',
    active: customer?.active ?? true,
  };

  const form = useForm<insertCustomerSchemaType>({
    mode: 'onBlur',
    resolver: zodResolver(insertCustomerSchema),
    defaultValues,
  });

  const {
    execute: executeSave,
    result: saveResult,
    isExecuting: isSaving,
    reset: resetAction,
  } = useAction(saveCustomerAction, {
    onSuccess({ data }) {
      toast('Success', {
        description: data.message,
      });
    },
    onError({ error }) {
      toast.error('Error', {
        description: 'Saved failed',
      });
    },
  });

  async function submitForm(data: insertCustomerSchemaType) {
    // Handle form submission logic here
    executeSave(data);
    // You can call an API to save the customer data
  }

  return (
    <div className='flex flex-col gap-1 sm:px-8'>
      <DisplayServerActionResponse result={saveResult} />
      <div>
        <h2 className='text-2xl font-bold'>
          {customer?.id ? `Edit` : 'New Customer'} Customer{' '}
          {customer?.id ? `#${customer.id}` : 'Form'}
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitForm)}
            className='flex flex-col md:flex-row gap-4 md:gap-8'
          >
            <div className='flex flex-col gap-4 w-full max-w-xs'>
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='First Name'
                nameInSchema='firstName'
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Last name'
                nameInSchema='lastName'
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Address Line 1'
                nameInSchema='address1'
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Address Line 2'
                nameInSchema='address2'
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='City'
                nameInSchema='city'
              />
              <SelectWithLabel<insertCustomerSchemaType>
                fieldTitle='State'
                nameInSchema='state'
                data={StatesArray}
              />
            </div>
            <div className='flex flex-col gap-4 w-full max-w-xs'>
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Zip Code'
                nameInSchema='zip'
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Email'
                nameInSchema='email'
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Phone'
                nameInSchema='phone'
              />
              <TextAreaWithLabel<insertCustomerSchemaType>
                fieldTitle='Notes'
                nameInSchema='notes'
                className='h-40'
              />
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                isManager &&
                customer?.id && (
                  <CheckBoxWithLabel<insertCustomerSchemaType>
                    fieldTitle='Active'
                    nameInSchema='active'
                    message='Yes'
                  />
                )
              )}
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
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CustomerForm;
