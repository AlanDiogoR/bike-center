import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de uso do site da Bike Center Fartura, loja de motos, bikes, peças e oficina na Rua Mário Stella, 355.",
  alternates: {
    canonical: siteUrl("termos-uso"),
  },
};

export default function TermosUsoPage() {
  return (
    <LegalPageLayout
      title="Termos de Uso"
      description="Condições para utilização do site e serviços."
      sections={[
        {
          title: "Aceitação",
          content: (
            <p>
              Ao utilizar o site da Bike Center, você concorda com estes Termos de Uso. O uso do
              site deve ser feito de forma lícita e respeitosa.
            </p>
          ),
        },
        {
          title: "Pedidos e pagamentos",
          content: (
            <p>
              Os pedidos realizados no site estão sujeitos à confirmação de disponibilidade e
              pagamento. Utilizamos parceiros de pagamento seguros para processar suas compras.
            </p>
          ),
        },
        {
          title: "Devoluções",
          content: (
            <p>
              Para questões relacionadas a pedidos, trocas e devoluções, consulte nossa política de
              atendimento. Oferecemos período de 14 dias para devolução ou troca.
            </p>
          ),
        },
        {
          title: "Contato",
          content: (
            <p>
              Dúvidas:{" "}
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
