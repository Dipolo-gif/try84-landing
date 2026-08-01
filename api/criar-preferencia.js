/**
 * Cria a cobrança no Mercado Pago e devolve a URL do checkout.
 *
 * ONDE ISSO RODA
 * Esta pasta /api funciona automaticamente na Vercel. Na Netlify, mova para
 * netlify/functions/ e troque o export pelo formato de lá.
 * O GitHub Pages NÃO executa este arquivo: ele só serve arquivos estáticos.
 * Enquanto o site estiver no Pages, este arquivo fica inerte.
 *
 * COMO LIGAR
 * 1. Publique o projeto na Vercel (vercel.com, plano gratuito serve).
 * 2. Em Settings > Environment Variables, crie MP_ACCESS_TOKEN com o access
 *    token de produção da sua conta Mercado Pago.
 * 3. No index.html, no bloco PAGAMENTO, coloque:
 *      api: '/api/criar-preferencia'
 *
 * POR QUE O TOKEN NÃO PODE IR PARA O index.html
 * Qualquer visitante abre o código-fonte da página e lê o que está lá. Com o
 * access token em mãos, uma pessoa consegue emitir e estornar cobranças na sua
 * conta. Ele só pode existir em variável de ambiente do servidor.
 */

// O preço tem que sair DAQUI, nunca do que o navegador enviou. Se a função
// confiar no valor recebido, qualquer pessoa altera o total no devtools e
// fecha o pedido por um centavo. O navegador manda o que quer comprar; o
// servidor decide quanto custa.
const CATALOGO = {
  // 'sku-do-produto': { titulo: 'Nome que aparece na fatura', preco: 29990 },
  'camiseta-selecao': { titulo: 'Camiseta Oficial Try84', preco: 29990 },
  'camiseta-clube':   { titulo: 'Camiseta Oficial Try84', preco: 29990 },
  'camiseta-retro':   { titulo: 'Camiseta Retro Try84',   preco: 34990 },
  'gorro':            { titulo: 'Gorro Oficial Try84',    preco: 12990 },
  'bone':             { titulo: 'Bone Oficial Try84',     preco: 9990 },
};

const FRETE_GRATIS_ACIMA_DE = 39999; // centavos, igual ao aviso do site

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return res.status(500).json({ erro: 'MP_ACCESS_TOKEN não configurado no servidor.' });
  }

  const { itens } = req.body || {};
  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: 'Sacola vazia.' });
  }

  // Monta os itens a partir do catálogo do servidor, ignorando qualquer preço
  // que tenha vindo do navegador.
  const itensValidados = [];
  for (const item of itens) {
    const produto = CATALOGO[item.sku];
    if (!produto) {
      return res.status(400).json({ erro: `Produto desconhecido: ${item.sku}` });
    }
    const qtd = Math.max(1, Math.min(20, parseInt(item.qtd, 10) || 1));
    itensValidados.push({
      title: produto.titulo,
      quantity: qtd,
      unit_price: produto.preco / 100,
      currency_id: 'BRL',
    });
  }

  const subtotal = itensValidados.reduce((s, i) => s + i.unit_price * 100 * i.quantity, 0);

  const preferencia = {
    items: itensValidados,
    back_urls: {
      success: `${process.env.SITE_URL || ''}/?pedido=aprovado`,
      pending: `${process.env.SITE_URL || ''}/?pedido=pendente`,
      failure: `${process.env.SITE_URL || ''}/?pedido=recusado`,
    },
    auto_return: 'approved',
    shipments: subtotal >= FRETE_GRATIS_ACIMA_DE ? { cost: 0, mode: 'not_specified' } : undefined,
  };

  try {
    const resposta = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preferencia),
    });

    const dados = await resposta.json();
    if (!resposta.ok) {
      console.error('Mercado Pago recusou a preferência:', dados);
      return res.status(502).json({ erro: 'Não foi possível iniciar o pagamento.' });
    }

    // init_point é o checkout de produção; sandbox_init_point é o de teste.
    return res.status(200).json({ url: dados.init_point });
  } catch (e) {
    console.error('Falha ao falar com o Mercado Pago:', e);
    return res.status(502).json({ erro: 'Não foi possível iniciar o pagamento.' });
  }
}
