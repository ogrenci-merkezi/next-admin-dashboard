'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Board } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import {
  Layers,
  Text,
  Users,
  FileText,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { CellAction } from './cell-action';
import { BOARD_TYPE_OPTIONS, STATUS_OPTIONS } from './options';

// Utility function to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Function to get appropriate board type label
function getBoardTypeLabel(type: string): string {
  const option = BOARD_TYPE_OPTIONS.find((opt) => opt.value === type);
  return option ? option.label : type;
}

export const columns: ColumnDef<Board>[] = [
  {
    accessorKey: 'profileImage',
    header: 'Avatar',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return (
        <Avatar className='h-9 w-9'>
          <AvatarImage src={row.getValue('profileImage')} alt={name} />
          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Board, unknown> }) => (
      <DataTableColumnHeader column={column} title='İsim' />
    ),
    cell: ({ row }) => (
      <Link
        href={`/boards/${row.original.id}`}
        className='font-medium hover:underline'
      >
        {row.getValue<string>('name')}
      </Link>
    ),
    meta: {
      label: 'İsim',
      placeholder: 'Tahta ara...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: ({ column }: { column: Column<Board, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tip' />
    ),
    cell: ({ cell }) => {
      const type = cell.getValue<Board['type']>();
      return (
        <Badge variant='outline' className='capitalize'>
          <Layers className='mr-1 h-3 w-3' />
          {getBoardTypeLabel(type)}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Tip',
      variant: 'multiSelect',
      options: BOARD_TYPE_OPTIONS
    }
  },
  {
    id: 'parentName',
    accessorKey: 'parentName',
    header: ({ column }: { column: Column<Board, unknown> }) => (
      <DataTableColumnHeader column={column} title='Üst Tahta' />
    ),
    cell: ({ cell }) => {
      const parentName = cell.getValue<string>();
      const parentId = cell.row.original.parentId;

      return parentName ? (
        <Link
          href={`/boards/${parentId}`}
          className='text-blue-600 hover:underline'
        >
          {parentName}
        </Link>
      ) : (
        '-'
      );
    }
  },
  {
    id: 'studentCount',
    accessorKey: 'studentCount',
    header: ({ column }: { column: Column<Board, unknown> }) => (
      <DataTableColumnHeader column={column} title='Öğrenciler' />
    ),
    cell: ({ cell }) => {
      return (
        <div className='flex items-center'>
          <Users className='text-muted-foreground mr-2 h-4 w-4' />
          {formatNumber(cell.getValue<number>())}
        </div>
      );
    }
  },
  {
    id: 'postCount',
    accessorKey: 'postCount',
    header: ({ column }: { column: Column<Board, unknown> }) => (
      <DataTableColumnHeader column={column} title='Gönderiler' />
    ),
    cell: ({ cell }) => {
      return (
        <div className='flex items-center'>
          <FileText className='text-muted-foreground mr-2 h-4 w-4' />
          {formatNumber(cell.getValue<number>())}
        </div>
      );
    }
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<Board, unknown> }) => (
      <DataTableColumnHeader column={column} title='Durum' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<'active' | 'inactive'>();
      const Icon = status === 'active' ? CheckCircle2 : XCircle;

      return (
        <Badge
          variant={status === 'active' ? 'default' : 'destructive'}
          className='capitalize'
        >
          <Icon className='mr-1 h-3 w-3' />
          {status === 'active' ? 'Aktif' : 'Pasif'}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Durum',
      variant: 'multiSelect',
      options: STATUS_OPTIONS
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
