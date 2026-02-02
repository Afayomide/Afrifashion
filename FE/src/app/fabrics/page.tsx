import { Suspense } from "react";
import Fabrics from "../../components/sections/fabrics";

async function getFabrics() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;
  try {
    const res = await fetch(`${apiUrl}/api/fabrics`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`Fetch failed with status: ${res.status}`);
      return [];
    }
    const data = await res.json();
    return data.fabrics;
  } catch (error) {
    console.error("Error fetching fabrics:", error);
    return [];
  }
}

export default async function FabricsPage() {
  const initialData = await getFabrics();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Fabrics initialData={initialData} />
    </Suspense>
  );
}
