'use client';

import { useFormStatus } from 'react-dom';
import { LoaderIcon } from 'lucide-react';
import { Button } from './ui/button';

const SearchButton = () => {
  const status = useFormStatus();

  return (
    <Button type='submit' disabled={status.pending} className='w-20'>
      {status.pending ? <LoaderIcon className='animate-spin' /> : 'Search'}
    </Button>
  );
};

export default SearchButton;
