import { ColumnDef } from '@tanstack/react-table';
import { SingleOccurrenceSearchResult } from '@/routes/occurrence/search/OccurrenceSearchPage';
import { LocalizedLink } from '@/components/LocalizedLink';

export const columns: ColumnDef<SingleOccurrenceSearchResult>[] = [
  {
    header: 'Scientific name',
    cell: ({ row }) => (
      <LocalizedLink to={`/occurrence/${row.original.key}`}>
        {row.original.scientificName}
      </LocalizedLink>
    ),
  },
  {
    header: 'County or area',
    accessorKey: 'county',
  },
  {
    header: 'Coordinates',
    accessorFn: ({ coordinates }) => {
      // Return null if coordinates are not valid
      if (typeof coordinates?.lat !== 'number' || typeof coordinates?.lon !== 'number') {
        return null;
      }

      const latitude =
        coordinates.lat > 0
          ? `${coordinates.lat.toFixed(2)}°N`
          : `${(-coordinates.lat).toFixed(2)}°S`;

      const longitude =
        coordinates.lon > 0
          ? `${coordinates.lon.toFixed(2)}°E`
          : `${(-coordinates.lon).toFixed(2)}°W`;

      return `${latitude}, ${longitude}`;
    },
  },
  {
    header: 'Year',
    accessorFn: ({ eventDate }) => new Date(eventDate).getFullYear(),
  },
  {
    header: 'Basis of record',
    accessorKey: 'basisOfRecord',
  },
  {
    header: 'Dataset',
    accessorFn: ({ datasetName }) => datasetName?.join(', '),
  },
  {
    header: 'Publisher',
    accessorKey: 'publisherTitle',
  },
];
