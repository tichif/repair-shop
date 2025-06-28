'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

import { type selectCustomerSchemaType } from '@/zod-schemas/customer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Props = {
  data: selectCustomerSchemaType[];
};

const CustomersTable = ({ data }: Props) => {
  const router = useRouter();

  const columnHeaderArray: Array<keyof selectCustomerSchemaType> = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'city',
    'zip',
  ];

  const columnHelper = createColumnHelper<selectCustomerSchemaType>();

  // const columns = [
  //   columnHelper.accessor('firstName', {
  //     header: 'First Name',
  //   }),
  //   columnHelper.accessor('lastName', {
  //     header: 'Last Name',
  //   }),
  // ];

  const columns = columnHeaderArray.map((columnName) => {
    return columnHelper.accessor(columnName, {
      id: columnName,
      header: columnName.charAt(0).toUpperCase() + columnName.slice(1),
    });
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='mt-6 rounded-lg overflow-hidden border-border'>
      <Table className='border'>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className='bg-secondary'>
                      <div>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow
                key={row.id}
                onClick={() =>
                  router.push(`/customers/form?customerId=${row.original.id}`)
                }
                className='cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40'
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id} className='border'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomersTable;
