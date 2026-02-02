import { Suspense } from "react";
import SearchResults from "../../components/sections/searchResults";

async function getSearchResults(searchTerm: string) {
  if (!searchTerm) return [];
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;
  try {
    const res = await fetch(`${apiUrl}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchTerm }),
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

export default async function Page({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const { q: searchTerm } = await searchParams;
  const initialData = await getSearchResults(searchTerm);

  return (
    <Suspense fallback={<div>Searching...</div>}>
      <SearchResults initialData={initialData} searchTerm={searchTerm} />
    </Suspense>
  );
}
