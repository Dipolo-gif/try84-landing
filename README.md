# TRY84 — Landing page

Landing page de e-commerce de roupas de rugby, em **arquivo único** (`index.html`).
Todo o CSS e o JavaScript estão embutidos, sem build, sem dependências de pacote.

Abra o `index.html` no navegador ou acesse a versão publicada.

## O que tem dentro

- Hero em tela cheia com parallax em duas camadas (fundo a 0,26× e tipografia a 0,13× do scroll)
- Vitrine de produtos com badges, preço em mono, seleção de tamanho e lightbox
- Tamanho é escolha obrigatória: sem ele o produto não entra na sacola, e cada
  tamanho vira uma linha própria
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

## Pagamento

Tudo é controlado por um único bloco no topo do `<script>` do `index.html`:

```js
var PAGAMENTO = {
  pix:      { chave: '', tipo: 'telefone', recebedor: '', cidade: '' },
  whatsapp: '',      // só dígitos com DDI. ex: 5584994137144
  linkFixo: '',      // link de pagamento fixo do Mercado Pago/PagSeguro
  api: ''            // endpoint da função serverless
};
```

O que ficar vazio não aparece na tela. Enquanto nada estiver preenchido, o
checkout mostra o aviso de demonstração e não processa nada.

### Pix copia e cola

Preencha `chave`, `tipo`, `recebedor` e `cidade`. O código Pix (BR Code) é
gerado no próprio navegador, com o valor exato da sacola, seguindo o padrão EMV
do Banco Central. O CRC16-CCITT foi conferido contra o valor de verificação
canônico do padrão (`123456789` → `29B1`).

O campo `tipo` importa: chave de telefone precisa virar `+55DDDNÚMERO`, chave de
CPF vai só com os 11 dígitos. Formato errado gera um código que não cai na sua
conta.

Limitação: a confirmação é manual, você confere no extrato. Pix com baixa
automática exige webhook, ou seja, servidor.

### WhatsApp

Preencha `whatsapp`. O botão monta a mensagem com itens, tamanhos e total e abre
a conversa. Funciona sem servidor nenhum.

### Cartão automático

Preencha `linkFixo` (mais simples, valor fixo) **ou** `api` (valor dinâmico).

Para o `api`, veja [`api/criar-preferencia.js`](api/criar-preferencia.js). Ele
roda na Vercel ou Netlify, **não no GitHub Pages**, que só serve arquivos
estáticos. Quando qualquer um dos dois estiver configurado, os campos de cartão
somem da tela e o cliente vai para o ambiente do meio de pagamento. É de
propósito: número de cartão em claro não pode passar pelo seu código, isso é
exigência de PCI-DSS.

Dois cuidados que já estão tratados no arquivo da função:

- A **chave secreta** fica em variável de ambiente, nunca no `index.html`, que é
  público.
- O **preço sai do servidor**, não do que o navegador enviou. Sem isso, dá para
  alterar o total no devtools e fechar o pedido por um centavo.

## Antes de usar em produção

Outros pontos a revisar:

- **Bandeiras aceitas** são placeholders. Confirme quais você realmente aceita.
- **Especificações do produto** (gramatura, costura, prazos, política de troca)
  são valores plausíveis que eu escrevi para a página não ficar vaga. Confira
  cada um antes de publicar: são promessas ao cliente.
- **CNPJ, WhatsApp, e-mail e redes sociais** estão comentados no HTML com TODO,
  não aparecem na página. Preencha com os dados reais.
- **Nomes de seleções e clubes** nos produtos são reais. Vender camisa oficial
  exige licenciamento; confirme antes de anunciar como oficial.
- **Imagens** ficam em `/assets`, servidas do próprio repositório. As fotos de
  ambiente são WebP; os produtos são mockups vetoriais em SVG, que pesam menos e
  não pixelam. Nenhuma requisição sai para servidor de terceiro.
- **Tipografia**: o design system pede Archivo Expanded, Instrument Sans e IBM Plex
  Mono. Como o requisito era não ter dependências externas, a página usa pilhas de
  fontes locais com as métricas do design system. Para carregar as fontes reais,
  adicione o `<link>` do Google Fonts no `<head>`.

## Créditos

Fotografia: [Pexels](https://www.pexels.com) e [Unsplash](https://unsplash.com),
sob licenças que permitem uso comercial.
