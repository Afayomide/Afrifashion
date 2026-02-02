import Home from "../components/home/home";

async function getPreviewData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;
  try {
    const res = await fetch(`${apiUrl}/api/clothespreview`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.previewData;
  } catch (error) {
    console.error("Error fetching preview data:", error);
    return null;
  }
}

export default async function Page() {
  const initialData = await getPreviewData();
  return <Home initialData={initialData} />;
}
