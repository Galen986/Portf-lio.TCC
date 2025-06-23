document.addEventListener("DOMContentLoaded", () => {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const listaProdutos = document.getElementById("lista-produtos");
  const valorTotalSpan = document.getElementById("valor-total");
  const freteGratisDiv = document.getElementById("frete-gratis");
  const descontoAplicadoDiv = document.getElementById("desconto-aplicado");
  const numeroParcelasSelect = document.getElementById("numero-parcelas");
  const valorParcelaSpan = document.getElementById("valor-parcela");
  const pixQrCodeDiv = document.getElementById("pix-qr-code");
  const boletoInfoDiv = document.getElementById("boleto-info");
  const informacoesCartaoDiv = document.getElementById("informacoes-cartao");
  const parcelamentoCartaoDiv = document.getElementById("parcelamento-cartao");
  const codigoBarrasInput = document.getElementById("codigo-barras-boleto");
  const confirmarPagamentoBtn = document.querySelector(".btn-animado");
  const numeroCartaoInput = document.getElementById("numero-cartao");
  const validadeCartaoInput = document.getElementById("validade-cartao");
  const cvvCartaoInput = document.getElementById("cvv-cartao");
  const enderecoInput = document.getElementById("endereco");

  let total = 0;

  // Exibe os produtos no carrinho
  if (carrinho.length === 0) {
    listaProdutos.innerHTML = "<li>Nenhum produto no carrinho.</li>";
  } else {
    carrinho.forEach((produto) => {
      const li = document.createElement("li");
      li.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)} (Quantidade: ${produto.quantidade})`;
      listaProdutos.appendChild(li);
      total += produto.preco * produto.quantidade;
    });
  }

  // DEFINA SUAS CONSTANTES DE DESCONTO/FRETE
const limiteFreteGratis = 300.0;
const descontoMinimo = 200.0;
const descontoPercentual = 0.1; // 10%

// FUNÇÃO CENTRAL: ATUALIZA O RESUMO DO PEDIDO (chame sempre que houver mudança!)
function atualizarResumoPedido() {
  let total = 0;
  listaProdutos.innerHTML = "";
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  if (carrinho.length === 0) {
    listaProdutos.innerHTML = "<li>Nenhum produto no carrinho.</li>";
  } else {
    carrinho.forEach((produto) => {
      const li = document.createElement("li");
      li.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)} (Quantidade: ${produto.quantidade})`;
      listaProdutos.appendChild(li);
      total += produto.preco * produto.quantidade;
    });
  }

  let totalComDesconto = total;
  let desconto = 0;

  // Lógica dos cupons
  if (cupomAplicado) {
    if (cupomAplicado.desconto > 0) {
      desconto = total * cupomAplicado.desconto;
      totalComDesconto -= desconto;
      descontoAplicadoDiv.style.display = "block";
      descontoAplicadoDiv.textContent = `Desconto aplicado: R$ ${desconto.toFixed(2)}`;
    } else {
      descontoAplicadoDiv.style.display = "none";
    }

    if (cupomAplicado.freteGratis) {
      freteGratisDiv.style.display = "block";
    } else {
      freteGratisDiv.style.display = total >= limiteFreteGratis ? "block" : "none";
    }
  } else {
    // Lógica padrão caso não haja cupom
    if (total >= descontoMinimo) {
      desconto = total * descontoPercentual;
      totalComDesconto -= desconto;
      descontoAplicadoDiv.style.display = "block";
      descontoAplicadoDiv.textContent = `Desconto aplicado: R$ ${desconto.toFixed(2)}`;
    } else {
      descontoAplicadoDiv.style.display = "none";
    }
    freteGratisDiv.style.display = total >= limiteFreteGratis ? "block" : "none";
  }

  valorTotalSpan.textContent = totalComDesconto.toFixed(2);

  // Atualiza as opções de parcelamento
  if (numeroParcelasSelect) {
    const numeroParcelas = parseInt(numeroParcelasSelect.value, 10) || 1;
    let valorParcela = totalComDesconto / numeroParcelas;
    if (numeroParcelas > 4) {
      const jurosPercentual = 0.05; // 5% de juros
      valorParcela += valorParcela * jurosPercentual;
    }
    valorParcelaSpan.textContent = `R$ ${valorParcela.toFixed(2)} por parcela`;
  }
}

// Sempre que o cupom for aplicado, recalcule:
if (aplicarCupomBtn) {
  aplicarCupomBtn.addEventListener('click', function() {
    const input = codigoPromocionalInput.value.trim().toUpperCase();
    mensagemCupomSpan.style.color = "green";
    if (cupons[input]) {
      cupomAplicado = cupons[input];
      mensagemCupomSpan.style.display = "inline";
      mensagemCupomSpan.textContent = "Cupom aplicado com sucesso!";
    } else {
      cupomAplicado = null;
      mensagemCupomSpan.style.display = "inline";
      mensagemCupomSpan.style.color = "red";
      mensagemCupomSpan.textContent = "Cupom inválido!";
    }
    atualizarResumoPedido();
  });
}

// Chame ao iniciar a página também!
atualizarResumoPedido();