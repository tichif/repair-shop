'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type Props<T> = {
  fieldTitle: string;
  nameInSchema: keyof T & string;
  data: DataObj[];
  className?: string;
};

type DataObj = {
  id: string;
  description: string;
};

export function SelectWithLabel<T>({
  fieldTitle,
  nameInSchema,
  data,
  className,
}: Props<T>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-base' htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>
          <Select {...field} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger
                className={`w-full max-w-xs ${className}`}
                id={nameInSchema}
              >
                <SelectValue placeholder='Select an option' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.map((item) => (
                <SelectItem key={`${nameInSchema}_${item.id}`} value={item.id}>
                  {item.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
