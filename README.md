# TRY84 — Landing page

Landing page de e-commerce de roupas de rugby, em **arquivo único** (`index.html`).
Todo o CSS e o JavaScript estão embutidos, sem build, sem dependências de pacote.

Abra o `index.html` no navegador ou acesse a versão publicada.

## O que tem dentro

- Hero em tela cheia com parallax em duas camadas (fundo a 0,26× e tipografia a 0,13× do scroll)
- Vitrine de produtos com badges, preço em mono, troca de foto no hover e lightbox
- Sacola lateral com estado real: quantidade, remoção, progresso de frete grátis e totais
- Tela de pagamento dedicada com Cartão, Pix e Boleto, resumo do pedido sempre visível
- Abas de Pagamento / Entrega / Trocas no padrão ARIA, navegáveis por setas
- Menu mobile, busca, FAQ em acordeão e newsletter com validação

## Acessibilidade

- HTML semântico, `alt` em todas as imagens, foco visível em todos os controles
- Contraste auditado: nenhuma reprovação no WCAG AA em 375, 819 e 1440 px
- Nenhum alvo de toque abaixo de 44 px
- Modais com foco preso, retorno de foco e fechamento por `Esc`
- Todo o movimento desligado sob `prefers-reduced-motion`

## Antes de usar em produção

**O pagamento é demonstração.** Nenhum dado sai da página: não há `action`, `fetch`
nem `XMLHttpRequest`. Para cobrar de verdade, integre um meio de pagamento
(Pagar.me, Mercado Pago, Stripe) usando os campos hospedados ou a tokenização
dele. Número de cartão em claro não pode passar pelo seu servidor: isso é
exigência de PCI-DSS.

Outros pontos a revisar:

- **Bandeiras aceitas** são placeholders. Confirme quais você realmente aceita.
- **Preços, CNPJ, WhatsApp e e-mail** estão como placeholder no texto.
- **Fotos** vêm de Pexels e Unsplash por URL. Para produção, baixe, converta para
  WebP e sirva do seu próprio domínio. As ilustrações vetoriais da marca ficam
  embutidas como fallback caso alguma foto não carregue.
- **Tipografia**: o design system pede Archivo Expanded, Instrument Sans e IBM Plex
  Mono. Como o requisito era não ter dependências externas, a página usa pilhas de
  fontes locais com as métricas do design system. Para carregar as fontes reais,
  adicione o `<link>` do Google Fonts no `<head>`.

## Créditos

Fotografia: [Pexels](https://www.pexels.com) e [Unsplash](https://unsplash.com),
sob licenças que permitem uso comercial.
