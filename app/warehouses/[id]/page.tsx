import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections/Footer";
import { WarehousePage } from "@/components/warehouse/WarehousePage";
import { formatAreaSqFt, warehouseById, warehouses } from "@/lib/data/warehouses";
import { warehouseHref } from "@/lib/routes";
import { pageMetadata, snippet } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return warehouses.map((warehouse) => ({ id: warehouse.id }));
}

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const warehouse = warehouseById(id);
  if (!warehouse) return { title: "Warehouse" };

  // "Warehouse in <city>, <state>" is what people search; the site name is already in the page name.
  const where = [...new Set([warehouse.city, warehouse.stateName])].join(", ");
  const title = `${warehouse.name} | Warehouse in ${where}`;
  const area =
    warehouse.leasableAreaMsf !== undefined ? `${formatAreaSqFt(warehouse.leasableAreaMsf)} ` : "";
  const description = snippet(
    `${warehouse.name} is a ${area}warehouse in ${warehouse.placeLine}, developed and managed by NDR Smart Spaces. See its location and connectivity, and book a site visit.`,
  );
  const photo = warehouse.detail.photos?.[0];

  return {
    ...pageMetadata({
      path: warehouseHref(warehouse.id),
      title,
      description,
      absoluteTitle: true,
      ...(photo
        ? { image: { url: photo.src, width: photo.width, height: photo.height, alt: photo.alt } }
        : {}),
    }),
    ...(warehouse.indexable ? {} : { robots: { index: false, follow: true } }),
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
