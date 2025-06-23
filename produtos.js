// Inicializa o carrinho vazio ao carregar a página
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Função para resetar o carrinho ao carregar ou atualizar a página
function resetarCarrinho() {
  localStorage.removeItem("carrinho"); // Remove o carrinho do localStorage
  carrinho = []; // Reinicializa o carrinho vazio
  atualizarResumoPedido(); // Atualiza o resumo para refletir o carrinho vazio
}

// Função para adicionar produtos ao carrinho com controle de quantidade
function adicionarProdutoComQuantidade(nome, preco) {
  const produtoExistente = carrinho.find((produto) => produto.nome === nome);

  if (produtoExistente) {
    produtoExistente.quantidade = (produtoExistente.quantidade || 1) + 1; // Incrementa a quantidade
  } else {
    carrinho.push({ nome, preco, quantidade: 1 }); // Adiciona o produto ao carrinho com quantidade inicial de 1
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho)); // Salva o carrinho no localStorage
  alert(`${nome} foi adicionado ao carrinho!`);
  atualizarResumoPedido(); // Atualiza o resumo na página de produtos
}

// Função para atualizar o resumo do pedido
function atualizarResumoPedido() {
  const listaProdutos = document.getElementById("lista-produtos");
  const valorTotalSpan = document.getElementById("valor-total");
  const freteGratisDiv = document.getElementById("frete-gratis");
  const descontoAplicadoDiv = document.getElementById("desconto-aplicado");

  if (!listaProdutos || !valorTotalSpan) {
    console.error("Elementos do resumo do pedido não encontrados.");
    return;
  }

  let total = 0;
  listaProdutos.innerHTML = ""; // Limpa a lista existente

  if (carrinho.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhum produto no carrinho.";
    listaProdutos.appendChild(li);
  } else {
    carrinho.forEach((produto) => {
      const li = document.createElement("li");
      li.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)} (Quantidade: ${produto.quantidade})`;
      listaProdutos.appendChild(li);
      total += produto.preco * produto.quantidade; // Calcula o total com base na quantidade
    });
  }

 // Defina seus cupons e regras
const cupons = {
  'FRETEGRATIS': { freteGratis: true, desconto: 0 },
  'DESCONTO10': { freteGratis: false, desconto: 0.10 },
  'SUPER20': { freteGratis: true, desconto: 0.20 }
};

let cupomAplicado = null;

document.getElementById('aplicar-cupom').addEventListener('click', function() {
  const input = document.getElementById('codigo-promocional').value.trim().toUpperCase();
  const mensagem = document.getElementById('mensagem-cupom');

  if (cupons[input]) {
    cupomAplicado = cupons[input];
    mensagem.style.display = "inline";
    mensagem.textContent = "Cupom aplicado com sucesso!";
    atualizarResumoPedido(); // função que recalcula o total e frete
  } else {
    cupomAplicado = null;
    mensagem.style.display = "inline";
    mensagem.style.color = "red";
    mensagem.textContent = "Cupom inválido!";
  }
});

  if (freteGratisDiv) {
    freteGratisDiv.style.display = total >= limiteFreteGratis ? "block" : "none";
  }

  let totalComDesconto = total;
  if (descontoAplicadoDiv) {
    if (total >= descontoMinimo) {
      const desconto = total * descontoPercentual;
      totalComDesconto -= desconto;
      descontoAplicadoDiv.style.display = "block";
      descontoAplicadoDiv.textContent = `Desconto aplicado: R$ ${desconto.toFixed(2)}`;
    } else {
      descontoAplicadoDiv.style.display = "none";
    }
  }

  valorTotalSpan.textContent = totalComDesconto.toFixed(2); // Atualiza o total no resumo
}

// Função para redirecionar para a página de pagamento
function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.");
    return;
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho)); // Salva o carrinho no localStorage
  window.location.href = "pagamento.html"; // Redireciona para a página de pagamento
}

// Adiciona eventos ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  resetarCarrinho(); // Reseta o carrinho ao carregar ou atualizar a página

  const botoesComprar = document.querySelectorAll(".btn-comprar");
  botoesComprar.forEach((botao) => {
    botao.addEventListener("click", (e) => {
      const card = e.target.closest(".card-produto");
      const nome = card.getAttribute("data-nome");
      const preco = parseFloat(card.getAttribute("data-preco"));
      adicionarProdutoComQuantidade(nome, preco); // Adiciona o produto ao carrinho com controle de quantidade
    });
  });

  const finalizarPedidoBtn = document.getElementById("finalizar-pedido");
  if (finalizarPedidoBtn) {
    finalizarPedidoBtn.addEventListener("click", finalizarPedido); // Adiciona evento ao botão "Finalizar Pedido"
  }

  atualizarResumoPedido(); // Atualiza o resumo ao carregar a página
});

// Função para adicionar produtos ao carrinho com controle de repetição
function adicionarProdutoSemRepeticao(nome, preco) {
  const produtoExistente = carrinho.find((produto) => produto.nome === nome);

  if (produtoExistente) {
    alert(`${nome} já está no carrinho!`);
  } else {
    carrinho.push({ nome, preco, quantidade: 1 }); // Adiciona o produto ao carrinho
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert(`${nome} foi adicionado ao carrinho!`);
    atualizarResumoPedido(); // Atualiza o resumo na página de produtos
  }
}

// Atualiza os eventos de clique nos botões "Comprar"
document.addEventListener("DOMContentLoaded", () => {
  const botoesComprar = document.querySelectorAll(".btn-comprar");
  botoesComprar.forEach((botao) => {
    botao.addEventListener("click", (e) => {
      const card = e.target.closest(".card-produto");
      const nome = card.getAttribute("data-nome");
      const preco = parseFloat(card.getAttribute("data-preco"));
      adicionarProdutoSemRepeticao(nome, preco); // Adiciona o produto ao carrinho sem repetição
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const inputBusca = document.getElementById("busca-produtos");
  const cardsProdutos = document.querySelectorAll(".card-produto");

  // Função para filtrar os produtos com base na busca
  inputBusca.addEventListener("input", () => {
    const termoBusca = inputBusca.value.toLowerCase().trim();

    cardsProdutos.forEach((card) => {
      const nomeProduto = card.getAttribute("data-nome").toLowerCase();
      if (nomeProduto.includes(termoBusca)) {
        card.style.display = "block"; // Exibe o produto
      } else {
        card.style.display = "none"; // Oculta o produto
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const metodoPagamentoRadios = document.querySelectorAll("input[name='metodo-pagamento']");
  const informacoesCartao = document.getElementById("informacoes-cartao");
  const parcelamentoCartao = document.getElementById("parcelamento-cartao");
  const pixQrCode = document.getElementById("pix-qr-code");
  const boletoInfo = document.getElementById("boleto-info");
  const paymentMessage = document.getElementById("payment-message");

  // Função para alternar entre os métodos de pagamento
  metodoPagamentoRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const metodoSelecionado = document.querySelector("input[name='metodo-pagamento']:checked").value;

      // Exibe ou oculta as seções com base no método selecionado
      if (metodoSelecionado === "cartao") {
        informacoesCartao.style.display = "block";
        parcelamentoCartao.style.display = "block";
        pixQrCode.style.display = "none";
        boletoInfo.style.display = "none";
      } else if (metodoSelecionado === "pix") {
        informacoesCartao.style.display = "none";
        parcelamentoCartao.style.display = "none";
        pixQrCode.style.display = "block";
        boletoInfo.style.display = "none";
      } else if (metodoSelecionado === "boleto") {
        informacoesCartao.style.display = "none";
        parcelamentoCartao.style.display = "none";
        pixQrCode.style.display = "none";
        boletoInfo.style.display = "block";
      }
    });
  });

  // Função para copiar o código de barras do boleto
  const copiarCodigoBarras = () => {
    const codigoBarrasInput = document.getElementById("codigo-barras-boleto");
    codigoBarrasInput.select();
    document.execCommand("copy");
    alert("Código de barras copiado!");
  };

  // Adiciona evento ao botão de copiar código de barras
  const copiarBoletoBtn = document.querySelector("button[onclick='copiarCodigoBarras()']");
  if (copiarBoletoBtn) {
    copiarBoletoBtn.addEventListener("click", copiarCodigoBarras);
  }

  // Exibe mensagem de confirmação ao enviar o formulário
  const formPagamento = document.getElementById("form-pagamento");
  formPagamento.addEventListener("submit", (e) => {
    e.preventDefault();
    paymentMessage.style.display = "block";
    paymentMessage.textContent = "Pagamento confirmado com sucesso!";
    localStorage.removeItem("carrinho"); // Limpa o carrinho após o pagamento
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const toggleMenuButton = document.querySelector('.btn-toggle-menu');
  const menu = document.querySelector('.menu');

  toggleMenuButton.addEventListener('click', () => {
    menu.classList.toggle('open'); // Adiciona ou remove a classe 'open'
  });
});