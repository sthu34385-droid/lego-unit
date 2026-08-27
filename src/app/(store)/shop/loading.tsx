export default function ShopLoading() {
  return (
    <div className="container-page py-16">
      <div className="h-10 w-48 animate-pulse rounded-full bg-line" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card aspect-[3/4] animate-pulse bg-white" />
        ))}
      </div>
    </div>
  );
}
