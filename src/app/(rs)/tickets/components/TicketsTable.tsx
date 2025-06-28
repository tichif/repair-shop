'use client';

import { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedUniqueValues,
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
import { Button } from '@/components/ui/button';
import Filter from '@/components/react-table/Filter';

type Props = {
  data: TicketSearchResultType;
};
type RowType = TicketSearchResultType[0];

const TicketTable = ({ data }: Props) => {
  const router = useRouter();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
    state: {
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className='mt-6 flex flex-col gap-4'>
      <div className='rounded-lg overflow-hidden border-border'>
        <Table className='border'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className='bg-secondary p-1'>
                        <div>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>
                        {header.column.getCanFilter() && (
                          <div className='grid place-content-center'>
                            <Filter column={header.column} />
                          </div>
                        )}
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
      <div className='flex justify-between items-center'>
        <div className='flex basis-1/3 items-center'>
          <p className='whitespace-nowrap font-bold'>
            {`Page ${
              table.getState().pagination.pageIndex + 1
            } of ${table.getPageCount()}`}
            &nbsp;&nbsp;
            {`[${table.getFilteredRowModel().rows.length} ${
              table.getFilteredRowModel().rows.length === 1
                ? 'result'
                : 'results'
            }]`}
          </p>
        </div>
        <div className='space-x-1'>
          <Button variant='outline' onClick={() => table.resetColumnFilters()}>
            Reset
          </Button>
          <Button
            variant='outline'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
          <Button
            variant='outline'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketTable;
