document.addEventListener("DOMContentLoaded", () => {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const listaProdutos = document.getElementById("lista-produtos");
  const valorTotalSpan = document.getElementById("valor-total");
  const freteGratisDiv = document.get = document.getElementById("numero-parcelas");
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
  const mensagemConfirmacao = document.getElementById("mensagem-confirmacao");

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

  const limiteFreteGratis = 300.0;
  const descontoMinimo = 200.0;
  const descontoPercentual = 0.1; // 10%

  // Exibe frete grátis ou desconto aplicado
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

  valorTotalSpan.textContent = totalComDesconto.toFixed(2);

  // Atualiza as opções de parcelamento
  if (numeroParcelasSelect && valorParcelaSpan) {
    numeroParcelasSelect.addEventListener("change", () => {
      const numeroParcelas = parseInt(numeroParcelasSelect.value, 10);
      let valorParcela = totalComDesconto / numeroParcelas;

      // Adiciona juros para parcelas acima de 4
      if (numeroParcelas > 4) {
        const jurosPercentual = 0.05; // 5% de juros
        valorParcela += valorParcela * jurosPercentual;
      }

      valorParcelaSpan.textContent = `R$ ${valorParcela.toFixed(2)} por parcela`;
    });
  }

  // Alterna entre Pix, Boleto e Cartão
  const metodoPagamentoRadios = document.querySelectorAll("input[name='metodo-pagamento']");
  metodoPagamentoRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const metodoSelecionado = document.querySelector("input[name='metodo-pagamento']:checked").value;

      pixQrCodeDiv.style.display = metodoSelecionado === "pix" ? "block" : "none";
      boletoInfoDiv.style.display = metodoSelecionado === "boleto" ? "block" : "none";
      informacoesCartaoDiv.style.display = metodoSelecionado === "cartao" ? "block" : "none";
      parcelamentoCartaoDiv.style.display = metodoSelecionado === "cartao" ? "block" : "none";
    });
  });

  // Garante que o QR Code esteja oculto inicialmente
  if (pixQrCodeDiv) pixQrCodeDiv.style.display = "none";

  // Exibe o QR Code apenas se "Pix" for selecionado
  metodoPagamentoRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const metodoSelecionado = document.querySelector("input[name='metodo-pagamento']:checked").value;
      if (pixQrCodeDiv) {
        pixQrCodeDiv.style.display = metodoSelecionado === "pix" ? "flex" : "none";
      }
    });
  });

  // Copiar código de barras do boleto
  const copiarCodigoBarras = () => {
    if (!codigoBarrasInput) {
      console.error("Campo de código de barras não encontrado.");
      alert("Erro interno: Não foi possível copiar o código de barras.");
      return;
    }

    codigoBarrasInput.select();
    document.execCommand("copy");
    alert("Código de barras copiado com sucesso!");
  };

  const copiarBoletoBtn = document.querySelector("button[onclick='copiarCodigoBarras()']");
  if (copiarBoletoBtn) {
    copiarBoletoBtn.addEventListener("click", copiarCodigoBarras);
  }

  // Validação dos campos antes de confirmar pagamento
  if (!confirmarPagamentoBtn) {
    console.error("Botão 'Confirmar Pagamento' não encontrado.");
    alert("Erro interno: Botão de confirmação de pagamento não encontrado.");
    return;
  }

  confirmarPagamentoBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Impede o redirecionamento imediato

    // Verifica se os campos do cartão estão preenchidos
    if (
      !numeroCartaoInput.value.trim() ||
      !validadeCartaoInput.value.trim() ||
      !cvvCartaoInput.value.trim() ||
      !enderecoInput.value.trim()
    ) {
      alert("Por favor, preencha todos os campos do cartão e endereço antes de confirmar o pagamento.");
      return;
    }

    // Valida o formato do número do cartão
    const regexCartao = /^\d{4} \d{4} \d{4} \d{4}$/;
    if (!regexCartao.test(numeroCartaoInput.value)) {
      alert("Número do cartão inválido. Use o formato XXXX XXXX XXXX XXXX.");
      return;
    }

    // Valida o formato da validade do cartão
    const regexValidade = /^\d{2}\/\d{2}$/;
    if (!regexValidade.test(validadeCartaoInput.value)) {
      alert("Validade do cartão inválida. Use o formato MM/AA.");
      return;
    }

    // Valida o formato do CVV
    const regexCVV = /^\d{3,4}$/;
    if (!regexCVV.test(cvvCartaoInput.value)) {
      alert("CVV inválido. Use 3 ou 4 dígitos.");
      return;
    }

    // Exibe a mensagem de confirmação
    if (mensagemConfirmacao) {
      mensagemConfirmacao.textContent = "Pagamento confirmado com sucesso!";
      mensagemConfirmacao.style.display = "block";
      setTimeout(() => {
        window.location.href = "produtos.html";
      }, 3000);
    } else {
      alert("Pagamento confirmado com sucesso!");
      window.location.href = "produtos.html";
    }
  });
});