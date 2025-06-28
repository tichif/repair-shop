'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { CircleCheck, CircleXIcon } from 'lucide-react';

import { type TicketSearchResultType } from '@/lib/queries/getTicketSearchResult';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Props = {
  data: TicketSearchResultType;
};
type RowType = TicketSearchResultType[0];

const TicketTable = ({ data }: Props) => {
  const router = useRouter();

  const columnHeaderArray: Array<keyof RowType> = [
    'title',
    'createdAt',
    'tech',
    'firstName',
    'lastName',
    'email',
    'completed',
  ];

  const columnHelper = createColumnHelper<RowType>();

  const columns = columnHeaderArray.map((columnName) => {
    return columnHelper.accessor(
      (row) => {
        // Transformational
        const value = row[columnName];
        if (columnName === 'createdAt' && value instanceof Date) {
          return value.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
        }

        if (columnName === 'completed') {
          return value ? 'COMPLETED' : 'OPEN';
        }

        return value;
      },
      {
        id: columnName,
        header: columnName.charAt(0).toUpperCase() + columnName.slice(1),
        cell: (info) => {
          // presentational
          const value = info.getValue();
          if (columnName === 'completed') {
            return (
              <div className='grid place-content-center'>
                {value === 'COMPLETED' ? (
                  <CircleCheck className='text-green-600' />
                ) : (
                  <CircleXIcon className='opacity-25' />
                )}
              </div>
            );
          }
          return value;
        },
      }
    );
  });

  const table = useReactTable({
    data: data,
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
                  router.push(`/tickets/form?ticketId=${row.original.id}`)
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

export default TicketTable;
