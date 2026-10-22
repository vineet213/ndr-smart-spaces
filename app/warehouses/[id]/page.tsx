import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections/Footer";
import { WarehousePage } from "@/components/warehouse/WarehousePage";
import { warehouseById, warehouses } from "@/lib/data/warehouses";

export const dynamicParams = false;

export function generateStaticParams() {
  return warehouses.map((warehouse) => ({ id: warehouse.id }));
}

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const warehouse = warehouseById(id);
  if (!warehouse) return { title: "Warehouse" };

  const title = `${warehouse.name}, ${warehouse.placeLine}`;
  const description =
    warehouse.detail.summary ??
    `Grade A warehousing at ${warehouse.placeLine}, developed and managed by NDR Smart Spaces.`;
  const photo = warehouse.detail.photos?.[0];

  return {
    title,
    description,
    ...(warehouse.indexable ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      type: "website",
      siteName: "NDR Smart Spaces",
      locale: "en_IN",
      title,
      description,
      ...(photo
        ? { images: [{ url: photo.src, width: photo.width, height: photo.height, alt: photo.alt }] }
        : {}),
    },
  };
}

export default async function WarehouseDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const warehouse = warehouseById(id);
  if (!warehouse) notFound();

  return (
    <>
      <WarehousePage warehouse={warehouse} />
      <Footer />
    </>
  );
}
