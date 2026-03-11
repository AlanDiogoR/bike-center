import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export const metadata = {
  title: "Aviso Legal",
  description:
    "Aviso Legal da Bike Center - Termos e condições de uso do site. Conheça seus direitos e obrigações ao utilizar nossos serviços.",
};

export default function AvisoLegalPage() {
  return (
    <LegalPageLayout
      title="Aviso Legal"
      description="Termos e condições que regem o uso do nosso site."
      sections={[
        {
          title: "1. Introdução",
          content: (
            <>
              <p className="mb-4">
                A Bike Center está comprometida com a transparência, conformidade e os mais altos
                padrões de integridade. Este Aviso Legal descreve os termos e condições que regem o
                uso do nosso site e garante total clareza para todos os usuários e clientes.
              </p>
              <p>
                Ao acessar este site, você aceita integralmente os seguintes termos. Em caso de
                discordância, solicitamos que não utilize o site.
              </p>
            </>
          ),
        },
        {
          title: "2. Finalidade deste documento",
          content: (
            <p>
              Este Aviso Legal estabelece os direitos, obrigações e responsabilidades dos usuários e
              da Bike Center, como operadora deste website. O acesso ao site não implica, de forma
              alguma, o estabelecimento de relação comercial ou contratual entre o usuário e a
              empresa.
            </p>
          ),
        },
        {
          title: "3. Termos de uso",
          content: (
            <>
              <p className="mb-4">Ao utilizar este website, você concorda em:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Não tentar acessar áreas restritas, dados ou sistemas da Bike Center ou terceiros.</li>
                <li>Não enviar, transmitir ou distribuir material prejudicial, ilegal ou ofensivo.</li>
                <li>Utilizar o site e seu conteúdo de forma legal, respeitosa e responsável.</li>
              </ul>
              <p>
                A violação desses termos pode resultar em restrição de acesso ou medidas legais
                quando aplicável.
              </p>
            </>
          ),
        },
        {
          title: "4. Responsabilidade do usuário",
          content: (
            <p>
              Os usuários são responsáveis pelo uso adequado e legal do website e de todos os
              serviços relacionados. A Bike Center reserva-se o direito de remover comentários,
              conteúdos ou contribuições que violem as leis vigentes, infrinjam direitos de
              terceiros ou sejam considerados inadequados ou ofensivos.
            </p>
          ),
        },
        {
          title: "5. Propriedade intelectual",
          content: (
            <p>
              Todos os direitos de propriedade intelectual e industrial relacionados a este
              website, incluindo seu conteúdo, imagens, textos, vídeos e logotipos, pertencem à Bike
              Center ou aos seus licenciadores autorizados. A reprodução, distribuição, modificação
              ou uso público de qualquer conteúdo sem autorização prévia por escrito é estritamente
              proibida.
            </p>
          ),
        },
        {
          title: "6. Limitação de responsabilidade",
          content: (
            <>
              <p className="mb-4">
                Embora façamos todos os esforços para garantir a precisão e disponibilidade das
                informações, a Bike Center não garante que todo o conteúdo esteja livre de erros ou
                permanentemente acessível. A empresa não se responsabiliza por:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Uso indevido ou interpretação incorreta das informações fornecidas no site.</li>
                <li>Perda de dados ou erros de sistema fora de seu controle.</li>
                <li>Interrupções de serviço ou falhas de rede.</li>
              </ul>
            </>
          ),
        },
        {
          title: "7. Links externos",
          content: (
            <p>
              Este website pode incluir links para sites de terceiros apenas para fins
              informativos. A Bike Center não endossa nem assume responsabilidade pelo conteúdo,
              disponibilidade ou precisão de tais sites externos. A visita a sites vinculados é de
              responsabilidade exclusiva do usuário.
            </p>
          ),
        },
        {
          title: "8. Lei aplicável e foro",
          content: (
            <p>
              Este Aviso Legal será regido e interpretado de acordo com as leis da República
              Federativa do Brasil. Qualquer disputa relacionada a estes termos será submetida ao
              foro da comarca de Fartura/SP, com exclusão de qualquer outro.
            </p>
          ),
        },
      ]}
    />
  );
}
