export function DetailedOcurrenceView({ data }) {
  return (
    <>
      <h1>
        Occurrence detail page
      </h1>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </>
  )
}