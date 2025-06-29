'use client';

import { useState, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedUniqueValues,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CircleCheck,
  CircleXIcon,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from 'lucide-react';

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
import { usePolling } from '@/hooks/usePolling';

type Props = {
  data: TicketSearchResultType;
};
type RowType = TicketSearchResultType[0];

const TicketTable = ({ data }: Props) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: false, //false for ascending, true for descending
    },
  ]);

  // Polling to refresh data every 60 seconds
  usePolling(360000, searchParams.get('searchText'));

  const pageIndex = useMemo(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page) - 1 : 0;
  }, [searchParams.get('page')]);

  const columnHeaderArray: Array<keyof RowType> = [
    'createdAt',
    'title',
    'tech',
    'firstName',
    'lastName',
    'email',
    'completed',
  ];

  const columnWidth = {
    completed: 150,
    createdAt: 150,
    title: 250,
    tech: 225,
    email: 225,
  };

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
        size: columnWidth[columnName as keyof typeof columnWidth] ?? undefined,
        header: ({ column }) => {
          return (
            <Button
              variant='ghost'
              className='pl-1 w-full flex justify-between'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              title={`Sort by ${columnName}`}
            >
              {columnName.charAt(0).toUpperCase() + columnName.slice(1)}
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className='ml-2 h-4 w-4' />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className='ml-2 h-4 w-4' />
              ) : (
                <ArrowUpDown className='ml-2 h-4 w-4' />
              )}
            </Button>
          );
        },
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
      sorting,
      pagination: {
        pageSize: 10,
        pageIndex,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
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
                      <TableHead
                        key={header.id}
                        className='bg-secondary p-1'
                        style={{ width: header.getSize() }}
                      >
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
                            <Filter
                              column={header.column}
                              filteredRows={table
                                .getFilteredRowModel()
                                .rows.map((row) =>
                                  row.getValue(header.column.id)
                                )}
                            />
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

      <div className='flex justify-between items-center gap-1 flex-wrap'>
        <div>
          <p className='whitespace-nowrap font-bold'>
            {`Page ${table.getState().pagination.pageIndex + 1} of ${Math.max(
              1,
              table.getPageCount()
            )}`}
            &nbsp;&nbsp;
            {`[${table.getFilteredRowModel().rows.length} ${
              table.getFilteredRowModel().rows.length !== 1
                ? 'total results'
                : 'result'
            }]`}
          </p>
        </div>
        <div className='flex flex-row gap-1'>
          <div className='flex flex-row gap-1'>
            <Button variant='outline' onClick={() => router.refresh()}>
              Refresh Data
            </Button>
            <Button variant='outline' onClick={() => table.resetSorting()}>
              Reset Sorting
            </Button>
            <Button
              variant='outline'
              onClick={() => table.resetColumnFilters()}
            >
              Reset Filters
            </Button>
          </div>
          <div className='flex flex-row gap-1'>
            <Button
              variant='outline'
              onClick={() => {
                const newIndex = table.getState().pagination.pageIndex - 1;
                table.setPageIndex(newIndex);
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', (newIndex + 1).toString());
                router.replace(`?${params.toString()}`, { scroll: false });
              }}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                const newIndex = table.getState().pagination.pageIndex + 1;
                table.setPageIndex(newIndex);
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', (newIndex + 1).toString());
                router.replace(`?${params.toString()}`, { scroll: false });
              }}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketTable;
