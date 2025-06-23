// scripts básicos para menu mobile e filtro de produtos

document.addEventListener("DOMContentLoaded", function () {
    // Toggle do menu mobile
    const btnToggle = document.querySelector(".btn-toggle-menu");
    const menu = document.querySelector(".menu");
  
    btnToggle.addEventListener("click", () => {
      menu.classList.toggle("open");
    });
  
    // Sistema simples de busca/filtro na página de produtos
    const buscaInput = document.getElementById("busca-produtos");
    const filtroSelect = document.getElementById("filtro-categoria");
    const cardsContainer = document.getElementById("cards-container");
    const cards = cardsContainer ? Array.from(cardsContainer.children) : [];
  
    if (buscaInput && filtroSelect && cards.length) {
      function filtrarProdutos() {
        const termo = buscaInput.value.toLowerCase();
        const categoria = filtroSelect.value;
  
        cards.forEach((card) => {
          const titulo = card.querySelector("h3").innerText.toLowerCase();
          const catCard = card.getAttribute("data-categoria").toLowerCase();
  
          const casaBusca = titulo.includes(termo);
          const casaFiltro = categoria === "todos" || catCard === categoria;
  
          if (casaBusca && casaFiltro) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      }
  
      buscaInput.addEventListener("input", filtrarProdutos);
      filtroSelect.addEventListener("change", filtrarProdutos);
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("busca-produtos");
    const productCards = document.querySelectorAll(".card-produto");
  
    searchInput.addEventListener("input", () => {
      const searchValue = searchInput.value.toLowerCase();
  
      productCards.forEach((card) => {
        const productName = card.querySelector("h3").textContent.toLowerCase();
        if (productName.includes(searchValue)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });