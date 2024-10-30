// Função para carregar o conteúdo da categoria no elemento #category-content
function loadCategory(page) {
  $('#category-content').load(page);
}

$(document).ready(function() {
  $('.modal').modal();
  updateCartBadge(); // Atualiza o badge ao carregar a página
});

// Inicializa o carrinho se ele ainda não estiver definido
var cart = cart || [];

// Função para adicionar itens ao carrinho
function addToCart(item, price) {
  cart.push({ item, price });
  M.toast({ html: `${item} adicionado ao carrinho!` });
  updateCartModal();
  updateCartBadge();
}

// Atualiza o modal do carrinho
function updateCartModal() {
  const cartItems = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('total-price');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((cartItem, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${cartItem.item} - R$ ${cartItem.price.toFixed(2)}
      <span class="remove-btn" onclick="removeFromCart(${index})"><i class="fas fa-trash-alt"></i></span>
    `;
    cartItems.appendChild(li);
    total += cartItem.price;
  });

  totalPriceEl.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Função de carregamento da categoria com rolagem suave até o início dos itens
function loadCategory(url) {
  $("#category-content").load(url, function() {
    // Após o carregamento do conteúdo, rola a página até o início dos itens
    $('html, body').animate({
      scrollTop: $("#category-content").offset().top - 100  // Ajuste para posicionar melhor os itens
    }, 700);  // Aumentei o tempo da animação para uma rolagem mais suave
  });
}
// Remove itens do carrinho
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartModal();
  updateCartBadge();
  M.toast({ html: 'Item removido do carrinho!' });
}

// Atualiza o badge do carrinho
function updateCartBadge() {
  const cartBadge = document.getElementById('cart-badge');
  const itemCount = cart.length;
  cartBadge.textContent = itemCount;
  cartBadge.style.display = itemCount > 0 ? 'inline' : 'none';
}

// Abre o modal do carrinho
function openCart() {
  updateCartModal();
  $('#cart-modal').modal('open');
}

// Finaliza o pedido e redireciona para o WhatsApp
function checkout() {
  if (cart.length === 0) {
    M.toast({ html: 'Seu carrinho está vazio!' });
    return;
  }

  let message = 'Olá, gostaria de fazer o seguinte pedido:';
  let total = 0;

  cart.forEach(cartItem => {
    message += `- ${cartItem.item} - R$ ${cartItem.price.toFixed(2)}`;
    total += cartItem.price;
  });

  message += `Total: R$ ${total.toFixed(2)}`;
  const whatsappNumber = '5517992845672';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  window.open(whatsappUrl, '_blank');
}
