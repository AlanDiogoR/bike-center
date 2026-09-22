import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de privacidade da Bike Center Fartura: como a loja trata dados de contato, pedidos e navegação no site.",
  alternates: {
    canonical: siteUrl("politica-privacidade"),
  },
};

export default function PoliticaPrivacidadePage() {
  return (
    <LegalPageLayout
      title="Política de Privacidade"
      description="Como coletamos, usamos e protegemos suas informações."
      sections={[
        {
          title: "Introdução",
          content: (
            <p>
              A Bike Center respeita sua privacidade. Esta política descreve como coletamos, usamos e
              protegemos suas informações ao utilizar nosso site e serviços.
            </p>
          ),
        },
        {
          title: "Dados coletados",
          content: (
            <p>
              Coletamos apenas as informações necessárias para processar pedidos, oferecer suporte e
              melhorar sua experiência. Isso pode incluir nome, e-mail, telefone, endereço e CPF quando
              necessário para a compra.
            </p>
          ),
        },
        {
          title: "Uso dos dados",
          content: (
            <p>
              Seus dados não são compartilhados com terceiros para fins de marketing sem seu
              consentimento. Utilizamos as informações para processar pedidos, envio de comunicações
              relacionadas à compra e melhorias no atendimento.
            </p>
          ),
        },
        {
          title: "Contato",
          content: (
            <p>
              Para dúvidas sobre privacidade, entre em contato:{" "}
              <a href="mailto:bikecenterfartura@gmail.com" className="text-brand-primary hover:underline">
                bikecenterfartura@gmail.com
              </a>
            </p>
          ),
        },
      ]}
    />
  );
}
