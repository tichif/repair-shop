'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  CellContext,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, TableOfContents } from 'lucide-react';
import Link from 'next/link';

import { type selectCustomerSchemaType } from '@/zod-schemas/customer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

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

  const ActionCell = ({
    row,
  }: CellContext<selectCustomerSchemaType, unknown>) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open Menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              href={`/tickets/form?customerId=${row.original.id}`}
              className='w-full'
              prefetch={false}
            >
              New Ticket
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/customers/form?customerId=${row.original.id}`}
              className='w-full'
              prefetch={false}
            >
              Edit Customer
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  ActionCell.displayName = 'ActionCell'; //prevent eslint error for displayName

  // const columns = [
  //   columnHelper.accessor('firstName', {
  //     header: 'First Name',
  //   }),
  //   columnHelper.accessor('lastName', {
  //     header: 'Last Name',
  //   }),
  // ];

  const columns = [
    columnHelper.display({
      id: 'Actions',
      header: () => <TableOfContents />,
      cell: ActionCell,
    }),
    ...columnHeaderArray.map((columnName) => {
      return columnHelper.accessor(columnName, {
        id: columnName,
        header: columnName.charAt(0).toUpperCase() + columnName.slice(1),
      });
    }),
  ];

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
                    <TableHead
                      key={header.id}
                      className={`bg-secondary ${
                        header.id === 'Actions' ? 'w-12' : ''
                      }`}
                    >
                      <div
                        className={`bg-secondary ${
                          header.id === 'Actions'
                            ? 'flex justify-center items-center'
                            : ''
                        }`}
                      >
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
