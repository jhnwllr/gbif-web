import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>
        GBIF.org
      </h1>
      <Link href="/occurrence/search">
        Occurrence search
      </Link>
    </>
  )
}
