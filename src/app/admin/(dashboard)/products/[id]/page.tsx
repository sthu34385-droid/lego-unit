import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { EditProductClient } from "./EditProductClient";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Edit product</h1>
          <p className="mt-1 text-muted">{product.name}</p>
        </div>
        <DeleteProductButton id={product.id} name={product.name} redirectTo="/admin/products" />
      </div>
      <div className="mt-6">
        <EditProductClient product={product} />
      </div>
    </div>
  );
}
