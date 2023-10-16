// TODO: Use some kind of dependency injection to get the Link component as it will not be available in the browser build
import Link from "next/link";

export function OccurrenceSearchView({ data }) {
  console.log(data);

  const currentPage = (data.documents.from / data.documents.size) + 1;
  const totalPages = Math.ceil(data.documents.total / data.documents.size)

  return (
    <>
      <h1>
        Occurrence search
      </h1>
      <ul>
        {data.documents.results.map(searchResult => (
          <li key={searchResult.key}>
            <Link href={`/occurrence/${searchResult.key}`}>
              <p>{searchResult.scientificName} - {searchResult.eventDate}</p>
            </Link>
          </li>
        ))}
      </ul>
      <p>
        Showing {data.documents.size} of {data.documents.total} results
      </p>
      <p>Page {currentPage} of {totalPages}</p>
      <button>Prev</button>
      <button>Next</button>
    </>
  )
}