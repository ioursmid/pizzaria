// Função para carregar o conteúdo da categoria no elemento #category-content
function loadCategory(page) {
  $('#category-content').load(page);
}

$(document).ready(function() {
  updateCartBadge(); // Atualiza o badge ao carregar a página

  // Mostrar campo de troco quando "Dinheiro" for selecionado
  $('#pagamento').change(function() {
    if ($(this).val() === 'Dinheiro') {
      $('#troco-container').show();
    } else {
      $('#troco-container').hide();
    }
  });
});

// Inicializa o carrinho se ele ainda não estiver definido
var cart = cart || [];

// Função para adicionar itens ao carrinho
function addToCart(item, price) {
  cart.push({ item, price });
  alert(`${item} adicionado ao carrinho!`); // Notificação substituída
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
    $('html, body').animate({
      scrollTop: $("#category-content").offset().top - 100
    }, 700);
  });
}

// Remove itens do carrinho
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartModal();
  updateCartBadge();
  alert('Item removido do carrinho!'); // Notificação substituída
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
  new bootstrap.Modal(document.getElementById('cart-modal')).show(); // Substitui .modal('open')
}

// Abre o modal de checkout para inserir endereço e forma de pagamento
function openCheckoutForm() {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!'); // Notificação substituída
    return;
  }
  new bootstrap.Modal(document.getElementById('checkout-modal')).show(); // Substitui .modal('open')
}

// Finaliza o pedido e redireciona para o WhatsApp
function finalizeOrder() {
  const rua = document.getElementById('rua').value;
  const numero = document.getElementById('numero').value;
  const bairro = document.getElementById('bairro').value;
  const referencia = document.getElementById('referencia').value;
  const pagamento = document.getElementById('pagamento').value;
  const troco = pagamento === 'Dinheiro' ? document.getElementById('troco').value : null;

  // Validação dos campos obrigatórios
  if (!rua || !numero || !bairro || !pagamento) {
    alert('Por favor, preencha todos os campos obrigatórios.'); // Notificação substituída
    return;
  }

  let message = `Olá, gostaria de fazer o seguinte pedido:\n\n`;
  let total = 0;

  cart.forEach(cartItem => {
    message += `- ${cartItem.item} - R$ ${cartItem.price.toFixed(2)}\n`;
    total += cartItem.price;
  });

  // Detalhes do pedido e endereço
  message += `\nTotal: R$ ${total.toFixed(2)}\n`;
  message += `Endereço: Rua ${rua}, Nº ${numero}, Bairro ${bairro}\n`;
  if (referencia) message += `Referência: ${referencia}\n`;
  message += `Forma de pagamento: ${pagamento}\n`;
  if (troco) message += `Troco para: R$ ${parseFloat(troco).toFixed(2)}\n`;

  const whatsappNumber = '5517999754390';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  // Redireciona para o WhatsApp com a mensagem
  window.open(whatsappUrl, '_blank');

  // Fecha o modal de checkout e limpa o carrinho
  bootstrap.Modal.getInstance(document.getElementById('checkout-modal')).hide();
  cart = [];
  updateCartModal();
  updateCartBadge();
}
