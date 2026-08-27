import Link from "next/link";
import { listProducts } from "@/lib/products";
import { formatMMK } from "@/lib/format";
import { getCategory } from "@/lib/categories";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-muted">{products.length} sets in the catalog</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add product
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="card mt-8 px-6 py-16 text-center">
          <p className="font-semibold">No products yet.</p>
          <Link href="/admin/products/new" className="btn btn-primary mt-4">
            Add the first set
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[1.25rem] border border-line bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">{getCategory(p.category).name}</td>
                  <td className="px-4 py-3">{formatMMK(p.isSale && p.salePrice ? p.salePrice : p.price)}</td>
                  <td className={`px-4 py-3 ${p.stock <= 5 ? "text-red" : ""}`}>{p.stock}</td>
                  <td className="px-4 py-3 text-xs">
                    {[p.isNew && "NEW", p.isBestSeller && "BEST", p.isSale && "SALE"].filter(Boolean).join(" · ") ||
                      "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link href={`/admin/products/${p.id}`} className="btn btn-ghost h-10 px-4 text-sm">
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
