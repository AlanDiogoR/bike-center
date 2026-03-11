import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export const metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso do site Bike Center.",
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
