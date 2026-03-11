import Link from "next/link";

interface ProductPaginationProps {
  page: number;
  total: number;
  limit: number;
  category?: string;
  search?: string;
}

export function ProductPagination({ page, total, limit, category, search }: ProductPaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const buildParams = (p: number) =>
    new URLSearchParams({
      ...(category && { category }),
      ...(search && { search }),
      page: String(p),
    }).toString();

  return (
    <div className="mt-12 flex flex-wrap justify-center items-center gap-4">
      {page > 1 && (
        <Link
          href={`/produtos?${buildParams(page - 1)}`}
          className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-medium rounded-full hover:border-brand-primary hover:text-brand-primary transition-colors"
        >
          ← Anterior
        </Link>
      )}
      <span className="px-4 py-2 text-gray-600 font-medium">
        Página {page} de {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={`/produtos?${buildParams(page + 1)}`}
          className="px-6 py-3 bg-brand-cta text-white font-medium rounded-full hover:bg-brand-ctaHover transition-colors"
        >
          Próxima →
        </Link>
      )}
    </div>
  );
}
