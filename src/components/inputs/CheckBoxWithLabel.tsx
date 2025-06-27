'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from '../ui/form';
import { Checkbox } from '../ui/checkbox';

type Props<T> = {
  fieldTitle: string;
  nameInSchema: keyof T & string;
  message: string;
  disabled?: boolean;
};

export function CheckBoxWithLabel<T>({
  fieldTitle,
  nameInSchema,
  message,
  disabled = false,
}: Props<T>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className='w-full flex items-center gap-2'>
          <FormLabel className='text-base w-1/3 mt-2' htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>
          <div className='flex items-center gap-2'>
            <FormControl>
              <Checkbox
                id={nameInSchema}
                {...field}
                onCheckedChange={field.onChange}
                checked={field.value}
                disabled={disabled}
              />
            </FormControl>
            {message}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
