import { getProducts, getCategories } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppLink } from "@/components/contact/StoreContactLinks";
import { COPY, STORE } from "@/lib/site";
import { ProductFilters } from "./components/ProductFilters";
import { ProductEmptyState } from "./components/ProductEmptyState";
import { ProductPagination } from "./components/ProductPagination";

export const CATALOG_H1 = "Catálogo de motos, bikes e peças em Fartura-SP";

export interface ProductListSearchParams {
  page?: string | string[];
  category?: string | string[];
  search?: string | string[];
}

function first(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v ? v : undefined;
}

/** Server component: a lista e os links /produtos/<slug> já vêm no HTML inicial. */
export async function ProductListPage({
  searchParams = {},
}: {
  searchParams?: ProductListSearchParams;
}) {
  const rawPage = Number(first(searchParams.page));
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
  const category = first(searchParams.category);
  const search = first(searchParams.search);

  let productsData: Awaited<ReturnType<typeof getProducts>> | undefined;
  let isError = false;
  try {
    productsData = await getProducts({ page, limit: 12, category, search });
  } catch {
    isError = true;
  }
  const categoriesData = await getCategories().catch(() => undefined);

  const products = productsData?.data ?? [];
  const meta = productsData?.meta;
  const categories = categoriesData?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 text-white py-8 sm:py-10">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <h1 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl uppercase tracking-wide mb-2 break-words">
            {search
              ? `Busca: ${search}`
              : category
                ? categories.find((c) => c.slug === category)?.name ?? "Produtos"
                : CATALOG_H1}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl">
            Motos, bikes, peças e oficina — loja física em Fartura-SP.
          </p>
          <p className="text-brand-primary font-semibold text-sm mt-2">{COPY.announcementPreferred}</p>
        </div>
      </section>

      <ProductFilters categories={categories} category={category} search={search} />

      <div className="max-w-container mx-auto px-4 sm:px-6 py-10">
        {isError ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-brand-text font-medium mb-2">Catálogo indisponível no momento.</p>
            <p className="text-gray-600 text-sm mb-6">
              Peça no WhatsApp ou veja os anúncios no Mercado Livre.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <WhatsAppLink line="claro" className="px-5 py-3">
                {COPY.ctaWhatsApp}
              </WhatsAppLink>
              <a
                href={STORE.mercadoLivreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center px-5 py-3 bg-[#FFE600] text-[#2B4D9E] font-semibold rounded-full"
              >
                {COPY.ctaMercadoLivre}
              </a>
            </div>
          </div>
        ) : products.length === 0 ? (
          <ProductEmptyState hasCategory={Boolean(category)} />
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              <span className="font-semibold text-gray-800">{meta?.total ?? 0}</span> produtos encontrados
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <ProductPagination
              page={page}
              total={meta?.total ?? 0}
              limit={12}
              category={category}
              search={search}
            />
          </>
        )}
      </div>
    </div>
  );
}
