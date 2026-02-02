import ItemsInfo from "../../components/sections/itemsInfo";
import { Metadata } from "next";

async function getProductData(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;
  try {
    const res = await fetch(`${apiUrl}/api/aboutItem/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    
    const relatedRes = await fetch(`${apiUrl}/api/related-Items/${id}`, { next: { revalidate: 3600 } });
    const relatedData = await relatedRes.json();
    
    return {
      item: data.item,
      relatedItems: relatedData.relatedItems
    };
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getProductData(id);
  if (!data || !data.item) {
    return {
      title: "Product Not Found | Afrifashion",
    };
  }

  const product = data.item;
  return {
    title: `${product.name || product.type} | Afrifashion`,
    description: Array.isArray(product.description) ? product.description[0] : product.description,
    openGraph: {
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initialData = await getProductData(id);
  return <ItemsInfo initialData={initialData} id={id} />;
}
