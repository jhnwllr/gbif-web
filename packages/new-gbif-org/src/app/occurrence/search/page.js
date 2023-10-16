import { GRAPHQL_API } from "@/config";
import { OccurrenceSearchView } from "@/views/OccurrenceSearchView";

async function getData(searchQuery, variables) {
	const response = await fetch(GRAPHQL_API, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query: `
			  query OccurrenceSearch($size: Int, $from: Int) {
				occurrenceSearch(size: $size, from: $from) {
				  documents {
					from
					size
					total
					results {
					  key
					  scientificName
					  eventDate
					}
				  }
				}
			  }
			`,
			variables,
			oprationName: 'OccurrenceSearch',
		}),
	});

	const data = await response.json();

	return data.data.occurrenceSearch;
}

export default async function Page(props) {
    const data = await getData(props.searchParams?.q);

    return <OccurrenceSearchView data={data} />
}