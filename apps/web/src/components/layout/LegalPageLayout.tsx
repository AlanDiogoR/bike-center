interface Section {
  title: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  description?: string;
  sections: Section[];
}

/**
 * Layout estilizado para páginas institucionais (Aviso Legal, Privacidade, Termos)
 * Inspirado na Pagani Design - conteúdo centralizado e elegante
 */
export function LegalPageLayout({
  title,
  description,
  sections,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-brand-text uppercase tracking-[0.02em] mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              {description}
            </p>
          )}
        </header>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <section
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8"
            >
              <h2 className="font-heading font-semibold text-xl text-brand-primary mb-4 border-b border-gray-100 pb-3">
                {section.title}
              </h2>
              <div className="prose prose-gray max-w-none text-brand-text/90 leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Dúvidas? Entre em contato:{" "}
            <a
              href="mailto:bikecenterfartura@gmail.com"
              className="text-brand-primary font-medium hover:underline"
            >
              bikecenterfartura@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
