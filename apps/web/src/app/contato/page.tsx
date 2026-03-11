export const metadata = {
  title: "Fale Conosco",
  description: "Entre em contato com a Bike Center.",
};

export default function ContatoPage() {
  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-12 md:py-16">
      <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-text uppercase tracking-[0.015em] mb-8">
        Fale Conosco
      </h1>
      <div className="max-w-xl space-y-4 text-gray-700">
        <p>
          Estamos à disposição para atendê-lo. Entre em contato:
        </p>
        <p>
          <strong>E-mail:</strong>{" "}
          <a href="mailto:bikecenterfartura@gmail.com" className="text-brand-primary hover:underline">
            bikecenterfartura@gmail.com
          </a>
        </p>
        <p>
          <strong>WhatsApp:</strong>{" "}
          <a href="https://wa.me/5514996325919" className="text-brand-primary hover:underline">
            (14) 99632-5919
          </a>
        </p>
        <p>
          <strong>WhatsApp Tim:</strong>{" "}
          <a href="https://wa.me/5514991667793" className="text-brand-primary hover:underline">
            (14) 99166-7793
          </a>
        </p>
        <p>
          <strong>Instagram:</strong>{" "}
          <a
            href="https://www.instagram.com/bikecenterfartura/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:underline"
          >
            @bikecenterfartura
          </a>
        </p>
        <p>
          <strong>TikTok:</strong>{" "}
          <a
            href="https://www.tiktok.com/@bikecenterfartura"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:underline"
          >
            @bikecenterfartura
          </a>
        </p>
      </div>
    </div>
  );
}
