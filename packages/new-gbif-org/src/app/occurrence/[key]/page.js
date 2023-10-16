import { GRAPHQL_API } from "@/config";
import { DetailedOcurrenceView } from "@/views/DetailedOcurrenceView";

async function getData(key) {

    const response = await fetch(GRAPHQL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
              query Occurrence($key: ID!) {
                occurrence(key: $key) {
                  eventDate
                  scientificName
                  coordinates
                }
              }
            `,
            variables: { key },
            oprationName: 'Occurrence',
        }),
    });

    const data = await response.json();

    return data.data.occurrence;
}

export default async function Page(props) {
    const data = await getData(props.params.key);

    return <DetailedOcurrenceView data={data} />
}