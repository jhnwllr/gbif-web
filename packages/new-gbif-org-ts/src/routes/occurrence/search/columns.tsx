import { ColumnDef } from '@tanstack/react-table';
import { SingleOccurrenceSearchResult } from '@/routes/occurrence/search/OccurrenceSearchPage';
import { LocalizedLink } from '@/components/LocalizedLink';
import { useI18n } from '@/contexts/i18n';

export const columns: ColumnDef<SingleOccurrenceSearchResult>[] = [
  {
    accessorKey: 'scientificName',
    header: 'Scientific name',
    cell: ({ row }) => (
      <LocalizedLink to={`/occurrence/${row.original.key}`}>
        {row.original.scientificName}
      </LocalizedLink>
    ),
  },
  {
    accessorKey: 'eventDate',
    header: 'Event date',
    cell: ({ row }) => {
      const i18n = useI18n();
      return new Intl.DateTimeFormat(i18n.locale.code).format(new Date(row.original.eventDate));
    },
  },
];
