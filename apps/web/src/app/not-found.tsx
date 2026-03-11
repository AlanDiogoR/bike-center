import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="font-heading font-bold text-4xl text-brand-text uppercase tracking-[0.015em] mb-2">
        404
      </h1>
      <p className="text-brand-text mb-6">Página não encontrada.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-brand-primary text-brand-primaryText font-semibold rounded-[60px] hover:bg-transparent hover:border-2 hover:border-brand-primary hover:text-brand-primary transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
