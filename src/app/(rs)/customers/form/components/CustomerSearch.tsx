import Form from 'next/form';

import { Input } from '@/components/ui/input';
import SearchButton from '@/components/SearchButton';

const CustomerSearch = () => {
  return (
    <Form action='/customers' className='flex gap-2 items-center'>
      <Input
        type='text'
        name='searchText'
        placeholder='Search customers'
        className='w-full'
      />
      <SearchButton />
    </Form>
  );
};

export default CustomerSearch;
